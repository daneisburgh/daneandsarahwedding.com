import { Op } from 'sequelize';

import xlsx from 'xlsx';
import fetch from 'node-fetch';
import * as fs from 'fs';

import User from '../../models/user';

const guestListFile = 'Guest List.xlsx';

interface GuestObject {
    Name: string;
    Address: string;
    Persons: number;
}

export default async function () {
    const url = process.env.GUEST_LIST_URL as string;
    const response = await fetch(url);
    const dest = fs.createWriteStream(`./${guestListFile}`);
    response.body.pipe(dest);
    dest.on('finish', async function () {
        await createOrUpdateUsers();
    });
};

async function generateUsername(name: string): Promise<string> {
    let split, splitName;

    if (name.includes('&')) {
        split = name.split(' & ');
        splitName = split[0].charAt(0) + '&' + split[1].charAt(0);
    } else {
        split = name.split(' ');
        splitName = split[0].charAt(0) + split[1].charAt(0);
    }

    const splitNameWildCard = `${splitName}%`;
    const findName = await User.findAndCountAll({ where: { username: { [Op.like]: splitNameWildCard } } });

    if (findName.count == 0) {
        return splitName;
    } else {
        const nameCount = findName.count + 1;
        return splitName + nameCount;
    }
}

async function generateGuestNames(name: string): Promise<Array<string>> {
    let splitSuffix, splitGuest, guest1, guest2, lastName, arrayGuests;
    if (name.includes(',')) {
        splitSuffix = name.split(',')[0];
    } else {
        splitSuffix = name;
    }
    if (splitSuffix.includes('&')) {
        splitGuest = splitSuffix.split(' & ');
        if (splitGuest[0].includes(' ')) {
            arrayGuests = [splitGuest[0], splitGuest[1]];
        }
        else {
            lastName = splitGuest[1].split(' ')[1];
            guest1 = splitGuest[0] + ' ' + lastName;
            guest2 = splitGuest[1].split(' ')[0] + ' ' + lastName;
            arrayGuests = [guest1, guest2];
        }
    } else {
        arrayGuests = [splitSuffix];
    }
    return arrayGuests;
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
                        const username = await generateUsername(guest.Name);

                        await User.create({
                            username,
                            name: guest.Name,
                            address: guest.Address,
                            minGuests: username.includes('&') ? 2 : 1,
                            maxGuests: guest.Persons,
                            guests: await generateGuestNames(guest.Name)
                        });
                    } else if (currentUser.address != guest.Address || currentUser.maxGuests != guest.Persons) {
                        await currentUser.update({
                            address: guest.Address,
                            maxGuests: guest.Persons,
                        });
                    }
                }
            }
        }

    }
}
