import { Server } from 'net';
import tunnelSSH from 'tunnel-ssh';

import tunnelConfig from '../tunnel-config';

async function seed() {
    await require('./scripts/users');
}

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        const tunnel = tunnelSSH(tunnelConfig, async (error: Error, server: Server) => {
            if (error) {
                throw error;
            } else {
                await seed();
            }

            tunnel.close();
        });
    } else {
        await seed();
    }
})();