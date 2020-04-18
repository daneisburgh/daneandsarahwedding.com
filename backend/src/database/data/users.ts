import xlsx from 'xlsx';

import User from '../models/user';

export = async function () {
    const workbook = xlsx.readFile('Guest list.xlsx');

    workbook.SheetNames.forEach(sheet => {
        console.log(sheet);
    });
}