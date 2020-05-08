import { Server } from 'net';
import tunnel from 'tunnel-ssh';

import users from './scripts/users';
import tunnelConfig from '../tunnel-config';

async function seed() {
    await users();
}

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        tunnel(tunnelConfig, async (error: Error, server: Server) => {
            if (error) {
                throw error;
            } else {
                await seed();
            }
        });
    } else {
        await seed();
    }
})();