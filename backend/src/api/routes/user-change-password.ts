import {
    getRequestBody,
    createResponse,
    createUserResponse,
    findUser,
    updateUser
} from '../utils';

export default async function (event: any) {
    try {
        const { code, password } = getRequestBody(event);
        let user = await findUser({ passwordChangeCode: code })

        if (!user) {
            return createResponse(400, 'Invalid link');
        } else if (user.passwordChangeExpiration < new Date()) {
            return createResponse(400, 'Link expired');
        } else if (!password) {
            return createResponse(400, 'Invalid password');
        } else {
            user = await updateUser(user.username, {
                password,
                passwordChangeCode: null,
                passwordChangeExpiration: null
            });

            return createResponse(200, createUserResponse(user));
        }
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

