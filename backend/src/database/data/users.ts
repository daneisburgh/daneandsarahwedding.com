import { Op } from 'sequelize';

import xlsx from 'xlsx';
import fetch from 'node-fetch';
import * as fs from 'fs';

import User from '../models/user';

const guestListFile = 'Guest List.xlsx';

interface GuestObject {
    Name: string;
    Address: string;
    Persons: number;
}

async function generateUsername(name: string): Promise<string> {
    let split, splitName;
    if (name.includes('&')) {
        split = name.split(' & ');
        splitName = split[0].charAt(0) + '&' + split[1].charAt(0);
    }
    else {
        split = name.split(' ');
        splitName = split[0].charAt(0) + split[1].charAt(0);
    }
    const splitNameWildCard = `${splitName}%`;
    const findName = await User.findAndCountAll({ where: { username: { [Op.like]: splitNameWildCard } } });
    if (findName.count == 0) {
        return splitName;
    }
    else {
        const nameCount = findName.count + 1;
        return splitName + nameCount;
    }
}

async function createOrUpdateUsers() {
    const workbook = xlsx.readFile(guestListFile);

    for (const sheetName of workbook.SheetNames) {
        if (sheetName == 'Tracey and Chris' || sheetName == 'Bob and Anne' || sheetName == 'Sarah and Dane') {
            const currentSheet = workbook.Sheets[sheetName];
            for (const value of xlsx.utils.sheet_to_json(currentSheet)) {
                const guest = value as GuestObject;

                if (guest.Name != undefined && guest.Address != undefined && guest.Persons != undefined) {

                    const currentUser = await User.findOne({ where: { name: guest.Name } });

                    if (!currentUser) {
                        await User.create({
                            username: await generateUsername(guest.Name),
                            name: guest.Name,
                            address: guest.Address,
                            maxGuests: guest.Persons,
                        });
                    }
                    else {
                        await currentUser.update({
                            name: guest.Name,
                            address: guest.Address,
                            maxGuests: guest.Persons,
                        });
                    }
                }
            }
        }

    }
}

export = async function () {
    const url = process.env.GUEST_LIST_URL as string;
    const response = await fetch(url);
    const dest = fs.createWriteStream(`./${guestListFile}`);
    response.body.pipe(dest);
    dest.on('finish', async function () {
        await createOrUpdateUsers();
    });
};
