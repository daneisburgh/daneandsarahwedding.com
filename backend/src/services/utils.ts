import { get, set } from 'lodash';

export function getRequestBody(event: object) {
    return get(event, 'body');
}

export function response(statusCode: number, body?: object) {
    return { statusCode, body: JSON.stringify(body) };
}
