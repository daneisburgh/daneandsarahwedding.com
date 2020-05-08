import { emailColumns } from '../../models/email';

export default {
    up: (queryInterface: any) => {
        return queryInterface.createTable('email', emailColumns);
    },

    down: (queryInterface: any) => {
        return queryInterface.dropTable('email');
    },
};
