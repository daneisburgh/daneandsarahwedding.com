import { pick } from 'lodash';

import {
    getRequestBody,
    getUserFromToken,
    createResponse,
    createUserResponse,
    updateUser
} from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { token, updatedColumns } = getRequestBody(event);
        let user: User | undefined = undefined;

        try {
            user = await getUserFromToken(token);
        } catch {
            return createResponse(401, 'Invalid token');
        }

        user = await updateUser(user.username,
            pick(updatedColumns, [
                'guests',
                'isAttending',
                'requiresAccommodations',
                'totalRequiredRooms',
                'requiresTransportation'
            ]));

        return createResponse(200, createUserResponse(user));
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

