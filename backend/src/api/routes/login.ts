import bcrypt from 'bcryptjs';
import { pick } from 'lodash';

import { createResponse, getRequestBody, createToken, verifyToken } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        let { username, password, token } = getRequestBody(event);

        if (token) {
            try {
                const decoded = verifyToken(token);
                username = decoded.username;
            } catch {
                return createResponse(401, 'Invalid Token');
            }
        }

        const user = await User.findOne({ where: { username: !!username ? username : '' } });

        if (!user) {
            return createResponse(401, 'Invalid Username');
        }

        if (!token && (
            (!user.isPasswordHashed && password !== user.password) ||
            (user.isPasswordHashed && !bcrypt.compareSync(password as string, user.password))
        )) {
            return createResponse(401, 'Invalid Password');
        }

        return createResponse(200, {
            token: createToken(username),
            user: pick(user, [
                'username',
                'name',
                'email',
                'isEmailConfirmed',
                'guests',
                'maxGuests',
                'isAdmin',
                'isAttending',
                'requiresAccommodations',
                'totalRequiredRooms',
                'requiresTransportation'
            ])
        });
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

