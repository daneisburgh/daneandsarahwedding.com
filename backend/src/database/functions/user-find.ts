import User from '../models/user';

const { API_KEY } = process.env;

export default async function (event: any) {
    const { apiKey, where } = event;

    if (apiKey !== API_KEY) {
        throw new Error('Invalid API key');
    } else {
        return await User.findOne({ where });
    }
}