import User from '../models/user';

const { API_KEY } = process.env;

export default async function (event: any) {
    const { apiKey, username, data } = event;

    if (apiKey !== API_KEY) {
        throw new Error('Invalid API key');
    } else {
        const user = await User.findByPk(username) as User;
        return await user.update(data);
    }
}