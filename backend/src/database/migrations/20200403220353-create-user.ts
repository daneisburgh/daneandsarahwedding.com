import { userColumns } from '../models/user';

export = {
    up: (queryInterface: any, Sequelize: any) => {
        return queryInterface.createTable('user', userColumns);
    },

    down: (queryInterface: any, Sequelize: any) => {
        return queryInterface.dropTable('user');
    },
};
