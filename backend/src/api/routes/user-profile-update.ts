import { pick } from 'lodash';

import { createResponse, getRequestBody, getUserFromToken } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { token, updatedUser } = getRequestBody(event);
        console.log(token, updatedUser);
        let user: User;

        try {
            user = await getUserFromToken(token);
        } catch {
            return createResponse(401, 'Invalid Token');
        }

        await user.update(pick(updatedUser, [
            'guests',
            'isAttending',
            'requiresAccommodations',
            'totalRequiredRooms',
            'requiresTransportation'
        ]));

        return createResponse(200);
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

