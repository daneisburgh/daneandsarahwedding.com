import { getRequestBody, createResponse, createUserResponse } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { code, password } = getRequestBody(event);
        const user = await User.findOne({ where: { passwordChangeCode: code } });

        if (!user) {
            return createResponse(400, 'Invalid link');
        } else if (user.passwordChangeExpiration < new Date()) {
            return createResponse(400, 'Link expired');
        } else if (!password) {
            return createResponse(400, 'Invalid password');
        } else {
            await user.update({
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

