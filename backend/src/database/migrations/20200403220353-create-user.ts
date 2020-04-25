import { userColumns } from '../models/user';

export = {
    up: (queryInterface: any) => {
        return queryInterface.createTable('user', userColumns);
    },

    down: (queryInterface: any) => {
        return queryInterface.dropTable('user');
    },
};
