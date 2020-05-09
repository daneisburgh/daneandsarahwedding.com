import { Sequelize } from 'sequelize';

const { NODE_ENV, DB_USERNAME, DB_PASSWORD } = process.env;

export default new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: NODE_ENV,
    username: DB_USERNAME,
    password: DB_PASSWORD
});