import validator from 'validator';

import { createResponse, getRequestBody } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { emailConfirmationToken } = getRequestBody(event);
        const user = await User.findOne({ where: { emailConfirmationToken } });

        if (!user) {
            return createResponse(400, 'Email confirmation link is invalid');
        } else if (user.emailConfirmationTokenExpiration < new Date()) {
            return createResponse(400, 'Email confirmation link has expired');
        } else {
            await user.update({
                isEmailConfirmed: true,
                emailConfirmationToken: null,
                emailConfirmationTokenExpiration: null
            });

            return createResponse(200);
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

