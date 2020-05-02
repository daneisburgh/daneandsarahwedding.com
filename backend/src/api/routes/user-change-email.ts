import validator from 'validator';

import { createResponse, getRequestBody, getUserFromToken, getRandomToken, getTokenExpiration } from '../utils';
import User from '../../database/models/user';
import sendEmail from '../../email';

export default async function (event: any) {
    try {
        const { token, email } = getRequestBody(event);
        let user: User;

        try {
            user = await getUserFromToken(token);
        } catch {
            return createResponse(401, 'Invalid Token');
        }

        if (!validator.isEmail(email)) {
            return createResponse(400, 'Invalid Email');
        } else if (user.email !== email && (await User.findOne({ where: { email } }))) {
            return createResponse(400, 'Email is Taken');
        } else {
            const expirationHours = 24;
            const emailVerificationExpiration = getTokenExpiration(expirationHours);

            await user.update({
                email,
                emailVerificationCode: await getRandomToken('emailVerificationCode'),
                emailVerificationExpiration,
                isEmailConfirmed: false
            });

            await sendEmail('email-confirmation', user, {
                expirationHours,
                confirmationUrl: `${process.env.CLIENT_URL}?emailVerificationCode=${user.emailVerificationCode}`
            });

            return createResponse(200);
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

