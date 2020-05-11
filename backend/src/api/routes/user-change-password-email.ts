import validator from 'validator';

import { getRequestBody, createResponse, createCodeAndExpiration } from '../utils';
import User from '../../database/models/user';
import sendEmail from '../../email';

export default async function (event: any) {
    try {
        const { email } = getRequestBody(event);

        if (!validator.isEmail(email)) {
            return createResponse(400, 'Invalid email');
        } else {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return createResponse(400, 'Invalid email');
            } else if (!user.isEmailVerified) {
                return createResponse(400, 'Email not verified');
            } else {
                const expirationHours = 2;
                const { code, expiration } = await createCodeAndExpiration('passwordChangeCode', expirationHours);

                await user.update({
                    passwordChangeCode: code,
                    passwordChangeExpiration: expiration
                });

                await sendEmail('change-password', user, {
                    expirationHours,
                    passwordChangeUrl: `${process.env.CLIENT_URL}?passwordChangeCode=${code}`
                });

                return createResponse(200);
            }
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

