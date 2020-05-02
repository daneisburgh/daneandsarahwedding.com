import { pick } from 'lodash';

import { getRequestBody, getUserFromToken, createResponse, createUserResponse } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { token, updatedColumns } = getRequestBody(event);
        let user: User;

        try {
            user = await getUserFromToken(token);
        } catch {
            return createResponse(401, 'Invalid Token');
        }

        await user.update(pick(updatedColumns, [
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

