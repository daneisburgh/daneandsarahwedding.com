import jwt from 'jsonwebtoken';
import { get, pick } from 'lodash';
import User from '../database/models/user';

const API_KEY = process.env.API_KEY as string;

export function getRequestBody(event: object) {
    return JSON.parse(get(event, 'body'));
}

export function createResponse(statusCode: number, body?: any) {
    return { statusCode, body: JSON.stringify(body) };
}

export function createUserResponse(user: User) {
    return {
        token: jwt.sign({ username: user.username }, API_KEY, { expiresIn: '1 week' }),
        user: pick(user, [
            'username',
            'name',
            'email',
            'emailVerificationExpiration',
            'isEmailVerified',
            'guests',
            'maxGuests',
            'isAdmin',
            'isAttending',
            'requiresAccommodations',
            'totalRequiredRooms',
            'requiresTransportation'
        ])
    };
}

export async function getUserFromToken(token: string) {
    const user = await User.findByPk((jwt.verify(token, API_KEY) as any).username);

    if (!user) {
        throw new Error();
    }

    return user;
}

export async function createCodeAndExpiration(codeKey: string, expirationHours: number): Promise<any> {
    const code = Math.random().toString(36).slice(2).substring(0, 5).toUpperCase();

    if (await User.findOne({ where: { [codeKey]: code } })) {
        return await createCodeAndExpiration(codeKey, expirationHours);
    } else {
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + (expirationHours * 60 * 60 * 1000));
        return { code, expiration };
    }
}