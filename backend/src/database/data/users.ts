import { isNumber, toNumber } from "lodash";
import { Op } from "sequelize";

import xlsx from "xlsx";

import User, { userColumns } from "../models/user";

interface GuestObject {
    Name: string;
    Address: string;
    Persons: number;
}

async function genUsername(name: string): Promise<string> {
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
    if (!findName) {
        return splitName;
    }
    else {
        const nameCount = findName.count + 1;
        return splitName + nameCount;
    }
}

export = async function () {
    //update this to pull in new file updated in google drive
    const workbook = xlsx.readFile("Guest List.xlsx");
    //add in something to loop through the sheets instead of just calling on single sheet
    const testSheetName = workbook.SheetNames[0];
    const testSheet = workbook.Sheets[testSheetName];
    let users: object[] = [];

    for (const value of xlsx.utils.sheet_to_json(testSheet)) {
        const guest = value as GuestObject;

        if (guest.Name != undefined && guest.Address != undefined && guest.Persons != undefined) {

            const currentUser = await User.findOne({ where: { name: guest.Name } });

            if (!currentUser) {
                users.push({
                    username: await genUsername(guest.Name),
                    name: guest.Name,
                    address: guest.Address,
                    maxGuests: guest.Persons,
                });
            }
            else {
                users.push({
                    username: currentUser.username,
                    name: guest.Name,
                    address: guest.Address,
                    maxGuests: guest.Persons,
                });
            }
        }
    }

    User.bulkCreate(users, {
        updateOnDuplicate: Object.keys(userColumns)
    });
};
