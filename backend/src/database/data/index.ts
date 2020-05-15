import { readFileSync } from 'fs';
import path from 'path';
import tunnelSsh from 'tunnel-ssh';
import Umzug from 'umzug';
import { promisify } from 'util';

const { APP_NAME, TUNNEL_USERNAME, TUNNEL_HOST, DB_HOST } = process.env;

async function migrateAndSeed() {
    const sequelize = require('../sequelize').default;
    const umzug = new Umzug({
        migrations: {
            path: path.resolve(__dirname, 'migrations'),
            params: [sequelize.getQueryInterface()]
        },
        storage: 'sequelize',
        storageOptions: { sequelize }
    });

    await umzug.up();
    await require('./seeders/users').default();
};

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        const tunnel = await promisify(tunnelSsh)({
            keepAlive: true,
            username: TUNNEL_USERNAME,
            host: TUNNEL_HOST,
            port: 22,
            privateKey: readFileSync(path.resolve(__dirname, `jenkins.pem`)),
            dstHost: DB_HOST,
            dstPort: 5432,
            localHost: 'localhost',
            localPort: 5432
        });

        process.env.TUNNEL = 'true';
        await migrateAndSeed();
        process.env.TUNNEL = undefined;
        tunnel.close();
    } else {
        await migrateAndSeed();
    }
})();