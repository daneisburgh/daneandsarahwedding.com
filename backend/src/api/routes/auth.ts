import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import { response, getRequestBody } from '../utils';
import User from '../../database/models/user';

const API_KEY = process.env.API_KEY as string;

interface Credentials {
    username?: string;
    password?: string;
    token?: string;
}

interface Decoded {
    username: string;
    iat: number;
    exp: number;
}

export default async function (event: any) {
    try {
        const credentials: Credentials = getRequestBody(event);
        let isValidCredentials = false;

        if (credentials.token) {
            try {
                const decoded = jwt.verify(credentials.token, API_KEY) as Decoded;
                credentials.username = decoded.username;
                isValidCredentials = true;
            } catch {
                return response(401, 'Invalid token');
            }
        }

        if (!credentials.username) {
            return response(401, 'Missing username');
        }

        const user = await User.findOne({ where: { username: credentials.username as string } });

        if (!user) {
            return response(401, 'Invalid username');
        }

        isValidCredentials = isValidCredentials ||
            (!user.isPasswordHashed && credentials.password === user.password) ||
            (user.isPasswordHashed && bcrypt.compareSync(credentials.password as string, user.password));

        if (!isValidCredentials) {
            return response(401, 'Invalid login');
        }

        return response(200, {
            token: jwt.sign({ username: user.username }, API_KEY, { expiresIn: '1 day' }),
            user: pick(user, [
                'username',
                'name',
                'address',
                'email',
                'isEmailConfirmed',
                'guests',
                'maxGuests',
                'isAdmin',
                'isGoing',
                'needsTransportation'
            ])
        });
    } catch (error) {
        console.error(error);
        return response(500);
    }
}

