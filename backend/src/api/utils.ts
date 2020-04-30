import jwt from 'jsonwebtoken';
import { get } from 'lodash';
import User from '../database/models/user';

const API_KEY = process.env.API_KEY as string;

export function getRequestBody(event: object) {
    return JSON.parse(get(event, 'body'));
}

export function createResponse(statusCode: number, body?: any) {
    return { statusCode, body: JSON.stringify(body) };
}

export function createTokenFromUsername(username: string) {
    return jwt.sign({ username }, API_KEY, { expiresIn: '1 week' });
}

export async function getUserFromToken(token: string) {
    const user = await User.findByPk((jwt.verify(token, API_KEY) as any).username);

    if (!user) {
        throw new Error();
    }

    return user;
}

export async function getRandomToken(tokenKey: string): Promise<string> {
    const token = Math.random().toString(36).substring(2);

    if (await User.findOne({ where: { [tokenKey]: token } })) {
        return await getRandomToken(tokenKey);
    } else {
        return token;
    }
}

export function getTokenExpiration(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}