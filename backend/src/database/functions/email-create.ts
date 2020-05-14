import Email from '../models/email';

const { API_KEY } = process.env;

export default async function (event: any) {
    const { apiKey, template, username } = event;

    if (apiKey !== API_KEY) {
        throw new Error('Invalid API key');
    } else {
        return await Email.create({ template, username });
    }
}