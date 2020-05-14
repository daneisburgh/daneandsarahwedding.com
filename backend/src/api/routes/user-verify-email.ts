import {
    getRequestBody,
    createResponse,
    createUserResponse,
    findUser,
    updateUser
} from '../utils';

export default async function (event: any) {
    try {
        const { code } = getRequestBody(event);
        let user = await findUser({ emailVerificationCode: code });

        if (!user) {
            return createResponse(400, 'Invalid link');
        } else if (user.emailVerificationExpiration < new Date()) {
            return createResponse(400, 'Link expired');
        } else {
            user = await updateUser(user.username, {
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

