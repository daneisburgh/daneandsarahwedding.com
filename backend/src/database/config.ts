export = {
    [process.env.NODE_ENV as string]: {
        dialect: 'postgres',
        database: process.env.APP_NAME as string,
        host: process.env.DB_HOST as string,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string
    }
}