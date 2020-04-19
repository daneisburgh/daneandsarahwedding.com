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

        if (credentials.token) {
            try {
                const decoded = jwt.verify(credentials.token, API_KEY) as Decoded;
                credentials.username = decoded.username;
            } catch {
                return response(401, 'Invalid Token');
            }
        }

        if (!credentials.username) {
            return response(401, 'Invalid Username');
        }

        const user = await User.findOne({ where: { username: credentials.username as string } });

        if (!user) {
            return response(401, 'Invalid Username');
        }

        if (!credentials.token && (
            (!user.isPasswordHashed && credentials.password !== user.password) ||
            (user.isPasswordHashed && !bcrypt.compareSync(credentials.password as string, user.password))
        )) {
            return response(401, 'Invalid Password');
        }

        return response(200, {
            token: jwt.sign({ username: user.username }, API_KEY, { expiresIn: '1 week' }),
            user: pick(user, [
                'username',
                'name',
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

