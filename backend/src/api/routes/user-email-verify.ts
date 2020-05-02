import validator from 'validator';

import { getRequestBody, createResponse, createUserResponse } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { emailVerificationCode } = getRequestBody(event);
        const user = await User.findOne({ where: { emailVerificationCode } });

        if (!user) {
            return createResponse(400, 'Email verification link is invalid');
        } else if (user.emailVerificationExpiration < new Date()) {
            return createResponse(400, 'Email verification link has expired');
        } else {
            await user.update({
                isEmailVerified: true,
                emailVerificationCode: null,
                emailVerificationExpiration: null
            });

            return createResponse(200, createUserResponse(user));
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

