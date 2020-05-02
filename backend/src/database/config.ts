export = {
    [process.env.NODE_ENV as string]: {
        dialect: 'postgres',
        database: process.env.NODE_ENV,
        host: process.env.DB_HOST as string,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string
    }
}