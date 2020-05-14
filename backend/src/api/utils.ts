import { Lambda } from 'aws-sdk';
import jwt from 'jsonwebtoken';
import { get, pick, isUndefined } from 'lodash';

import User from '../database/models/user';

const { NODE_ENV, APP_NAME, REGION, API_KEY } = process.env;
const lambda = new Lambda({
    endpoint: NODE_ENV === 'development' ?
        'http://localhost:3000' : `https://lambda.${REGION}.amazonaws.com`
});

export function getRequestBody(event: object) {
    const body = get(event, 'body');
    const bodyString = get(event, 'isBase64Encoded') ? Buffer.from(body, 'base64').toString('ascii') : body;
    return JSON.parse(bodyString);
}

export function createResponse(statusCode: number, body?: any) {
    return { statusCode, body: JSON.stringify(body) };
}

export function createUserResponse(user: User) {
    return {
        token: jwt.sign({ username: user.username }, API_KEY as string, { expiresIn: '1 week' }),
        user: pick(user, [
            'username',
            'name',
            'email',
            'emailVerificationExpiration',
            'isEmailVerified',
            'guests',
            'minGuests',
            'maxGuests',
            'isAttending',
            'requiresAccommodations',
            'totalRequiredRooms',
            'requiresTransportation'
        ])
    };
}

export async function getUserFromToken(token: string) {
    const username = (jwt.verify(token, API_KEY as string) as any).username;
    const user = await findUser({ username });

    if (!user) {
        throw new Error();
    } else {
        return user;
    }
}

export async function createCodeAndExpiration(codeKey: string, expirationHours: number): Promise<any> {
    const code = Math.random().toString(36).slice(2).substring(0, 5).toUpperCase();

    if (await findUser({ [codeKey]: code })) {
        return await createCodeAndExpiration(codeKey, expirationHours);
    } else {
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + (expirationHours * 60 * 60 * 1000));
        return { code, expiration };
    }
}

export async function sendEmail(template: string, user: User, locals: object) {
    await invokeFunction('email', { template, user, locals });
    await invokeFunction('database-email-create', { template, username: user.username });
}

export async function findUser(data: object) {
    const payload = await invokeFunction('database-user-find', { where: data });
    return isUndefined(payload) ? undefined : JSON.parse(payload) as User;
}

export async function updateUser(username: string, data: object) {
    const payload = await invokeFunction('database-user-update', { username, data });

    if (!payload) {
        throw new Error('Error updating user');
    } else {
        return JSON.parse(payload) as User;
    }
}

async function invokeFunction(name: string, data: object) {
    const response = await lambda.invoke({
        FunctionName: `${APP_NAME}-${NODE_ENV}-${name}`,
        Payload: JSON.stringify({
            apiKey: API_KEY,
            ...data
        })
    }).promise();

    if (response.FunctionError) {
        throw new Error(response.Payload?.toString());
    } else {
        return response.Payload ? response.Payload.toString() : undefined;
    }
}