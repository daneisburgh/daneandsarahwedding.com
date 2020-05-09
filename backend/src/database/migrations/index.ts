import { Server } from 'net';
import path from 'path';
import tunnelSSH from 'tunnel-ssh';
import Umzug from 'umzug';

import tunnelConfig from '../tunnel-config';

async function migrate() {
    const sequelize = require('../sequelize').default;

    const umzug = new Umzug({
        migrations: {
            path: path.resolve(__dirname, 'scripts'),
            params: [sequelize.getQueryInterface()]
        },
        storage: 'sequelize',
        storageOptions: { sequelize }
    });

    await umzug.up();
};

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        const tunnel = tunnelSSH(tunnelConfig, async (error: Error, server: Server) => {
            if (error) {
                throw error;
            } else {
                await migrate();
            }

            tunnel.close();
        });
    } else {
        await migrate();
    }
})();