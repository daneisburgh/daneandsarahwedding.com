import { Sequelize } from 'sequelize';

const { APP_NAME, NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOST, TUNNEL } = process.env;

export default new Sequelize({
    dialect: 'postgres',
    host: NODE_ENV === 'development' || TUNNEL === 'true' ? 'localhost' : DB_HOST,
    port: 5432,
    database: `${APP_NAME}-${NODE_ENV}`,
    username: DB_USERNAME,
    password: DB_PASSWORD
});