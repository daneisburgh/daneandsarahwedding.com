import bcrypt from 'bcryptjs';

import {
    getRequestBody,
    getUserFromToken,
    createResponse,
    createUserResponse,
    findUser
} from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { username, password, token } = getRequestBody(event);
        let user: User | undefined = undefined;

        if (username) {
            user = await findUser({ username });
        } else if (token) {
            try {
                user = await getUserFromToken(token);
            } catch {
                return createResponse(401, 'Invalid token');
            }
        }

        if (!user) {
            return createResponse(401, 'Invalid username');
        } else if (!token && (
            (!user.isPasswordHashed && password !== user.password) ||
            (user.isPasswordHashed && !bcrypt.compareSync(password as string, user.password))
        )) {
            return createResponse(401, 'Invalid password');
        } else {
            return createResponse(200, createUserResponse(user));
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

