import validator from 'validator';

import { getRequestBody, getUserFromToken, createResponse, createUserResponse, createCodeAndExpiration } from '../utils';
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
            return createResponse(400, 'Invalid email');
        } else if (user.email && user.email === email) {
            return createResponse(400, 'Email not changed');
        } else if (user.email !== email && (await User.findOne({ where: { email } }))) {
            return createResponse(400, 'Email is taken');
        } else {
            const expirationHours = 24;
            const { code, expiration } = await createCodeAndExpiration('emailVerificationCode', expirationHours);

            await user.update({
                email,
                emailVerificationCode: code,
                emailVerificationExpiration: expiration,
                isEmailVerified: false
            });

            await sendEmail('email-verification', user, {
                expirationHours,
                verificationUrl: `${process.env.CLIENT_URL}?emailVerificationCode=${code}`
            });

            return createResponse(200, createUserResponse(user));
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

