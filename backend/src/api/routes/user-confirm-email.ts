import validator from 'validator';

import { createResponse, getRequestBody } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { emailConfirmationToken } = getRequestBody(event);
        const user = await User.findOne({ where: emailConfirmationToken });

        if (!user) {
            return createResponse(401, 'Invalid Token');
        } else if (!user.emailConfirmationToken === emailConfirmationToken) {
            return createResponse(400, 'Invalid Confirmation Token');
        } else if (user.emailConfirmationTokenExpiration < new Date()) {
            return createResponse(400, 'Confirmation Token Expired');
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

