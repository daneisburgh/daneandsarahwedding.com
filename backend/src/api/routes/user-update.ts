import { pick } from 'lodash';

import { createResponse, getRequestBody, verifyToken } from '../utils';
import User from '../../database/models/user';

export default async function (event: any) {
    try {
        const { token, user } = getRequestBody(event);
        let username: string;

        try {
            const decoded = verifyToken(token);
            username = decoded.username;
        } catch {
            return createResponse(401, 'Invalid Token');
        }

        if (!username) {
            return createResponse(401, 'Invalid Username');
        }

        await User.update(pick(user, [
            'guests',
            'isAttending',
            'requiresAccommodations',
            'totalRequiredRooms',
            'requiresTransportation'
        ]), { where: { username } });

        return createResponse(200);
    } catch (error) {
        console.error(error);
        return createResponse(500);
    }
}

