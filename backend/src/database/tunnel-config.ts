import { readFileSync } from 'fs';
import path from 'path';

const { TUNNEL_USERNAME, TUNNEL_HOST, TUNNEL_KEY_PATH, TUNNEL_DESTINATION_HOST } = process.env;

export default {
    username: TUNNEL_USERNAME,
    host: TUNNEL_HOST,
    port: 22,
    privateKey: readFileSync(path.resolve(__dirname, TUNNEL_KEY_PATH as string)),
    dstHost: TUNNEL_DESTINATION_HOST,
    dstPort: 5432,
    localHost: 'localhost',
    localPort: 5432
};