import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import { response, getRequestBody } from '../utils';
import User from '../../database/models/user';

const API_KEY = process.env.API_KEY as string;

interface Decoded {
    username: string;
    iat: number;
    exp: number;
}

export default async function (event: any) {
    try {
        let { username, password, token } = getRequestBody(event);

        if (token) {
            try {
                const decoded = jwt.verify(token, API_KEY) as Decoded;
                username = decoded.username;
            } catch {
                return response(401, 'Invalid Token');
            }
        }

        if (!username) {
            return response(401, 'Invalid Username');
        }

        const user = await User.findOne({ where: { username: username as string } });

        if (!user) {
            return response(401, 'Invalid Username');
        }

        if (!token && (
            (!user.isPasswordHashed && password !== user.password) ||
            (user.isPasswordHashed && !bcrypt.compareSync(password as string, user.password))
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
                'isAttending',
                'needsAccommodation',
                'totalRooms',
                'needsTransportation'
            ])
        });
    } catch (error) {
        console.error(error);
        return response(500);
    }
}

