import jwt from 'jsonwebtoken';
import { get } from 'lodash';

const API_KEY = process.env.API_KEY as string;

interface Decoded {
    username: string;
    iat: number;
    exp: number;
}

export function getRequestBody(event: object) {
    return JSON.parse(get(event, 'body'));
}

export function createResponse(statusCode: number, body?: any) {
    return { statusCode, body: JSON.stringify(body) };
}

export function createToken(username: string) {
    return jwt.sign({ username }, API_KEY, { expiresIn: '1 week' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, API_KEY) as Decoded;
}