import { readFileSync } from 'fs';
import { Server } from 'net';
import path from 'path';
import tunnel from 'tunnel-ssh';
import Umzug from 'umzug';

const { TUNNEL_USERNAME, TUNNEL_HOST, TUNNEL_KEY_PATH, TUNNEL_DESTINATION_HOST } = process.env;

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
    await require('./seeders/users');
};

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        tunnel({
            keepAlive: true,
            username: TUNNEL_USERNAME,
            host: TUNNEL_HOST,
            port: 22,
            privateKey: readFileSync(path.resolve(__dirname, TUNNEL_KEY_PATH as string)),
            dstHost: TUNNEL_DESTINATION_HOST,
            dstPort: 5432,
            localHost: 'localhost',
            localPort: 5432
        }, async (error: Error, server: Server) => {
            if (error) {
                throw error;
            } else {
                await migrateAndSeed();
            }

            server.close();
        });
    } else {
        await migrateAndSeed();
    }
})();