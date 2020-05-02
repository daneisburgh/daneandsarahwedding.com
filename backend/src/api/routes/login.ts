import bcrypt from 'bcryptjs';

import { getRequestBody, getUserFromToken, createResponse, createUserResponse } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const body = getRequestBody(event);
        const { token, username, password } = body;
        let user: User | null;

        if (token) {
            try {
                user = await getUserFromToken(token);
            } catch {
                return createResponse(401, 'Invalid token');
            }
        } else {
            user = await User.findByPk(username);
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

