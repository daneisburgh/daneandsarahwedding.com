import { Sequelize } from 'sequelize';

import config from './config';
const params = config[process.env.NODE_ENV as string];

export = new Sequelize(params.database, params.username, params.password, {
    host: params.host,
    dialect: 'postgres'
});