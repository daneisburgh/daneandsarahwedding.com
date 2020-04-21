import User from '../models/user';

export = async function () {
    await User.create({
        username: 'D&S',
        name: 'Dane & Sarah Isburgh',
        address: '7907 Ramble View #304, Cincinnati OH, 45231',
        maxGuests: 2,
        isAdmin: true
    });
}