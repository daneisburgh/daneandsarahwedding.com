import { Sequelize } from 'sequelize';

import config from './config';
const params = config[process.env.NODE_ENV as string];

export = new Sequelize({
    dialect: 'postgres',
    host: params.host,
    database: params.database,
    username: params.username,
    password: params.password
})