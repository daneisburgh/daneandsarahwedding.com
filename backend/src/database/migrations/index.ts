import { Server } from 'net';
import path from 'path';
import tunnel from 'tunnel-ssh';
import Umzug from 'umzug';

import sequelize from '../sequelize';
import tunnelConfig from '../tunnel-config';

const umzug = new Umzug({
    storageOptions: { sequelize },
    migrations: {
        path: path.resolve(__dirname, 'scripts'),
        params: [
            sequelize.getQueryInterface()
        ]
    }
});

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        tunnel(tunnelConfig, async (error: Error, server: Server) => {
            if (error) {
                throw error;
            } else {
                await umzug.up();
            }
        });
    } else {
        await umzug.up();
    }
})();