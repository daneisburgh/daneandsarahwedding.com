import validator from 'validator';

import {
    getRequestBody,
    getUserFromToken,
    createResponse,
    createUserResponse,
    createCodeAndExpiration,
    sendEmail,
    findUser,
    updateUser
} from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { token, email } = getRequestBody(event);
        let user: User | undefined = undefined;

        try {
            user = await getUserFromToken(token);
        } catch {
            return createResponse(401, 'Invalid token');
        }

        if (!validator.isEmail(email)) {
            return createResponse(400, 'Invalid email');
        } else if (user.email !== email && await findUser({ email })) {
            return createResponse(400, 'Email is taken');
        } else {
            const expirationHours = 24;
            const { code, expiration } = await createCodeAndExpiration('emailVerificationCode', expirationHours);

            user = await updateUser(user.username, {
                email,
                emailVerificationCode: code,
                emailVerificationExpiration: expiration,
                isEmailVerified: false
            });

            await sendEmail('email-verification', user, {
                expirationHours,
                emailVerificationUrl: `${process.env.CLIENT_URL}?emailVerificationCode=${code}`
            });

            return createResponse(200, createUserResponse(user));
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

