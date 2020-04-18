import { get } from 'lodash';

export function getRequestBody(event: object) {
    return JSON.parse(get(event, 'body'));
}

export function response(statusCode: number, body?: any) {
    return { statusCode, body: JSON.stringify(body) };
}
