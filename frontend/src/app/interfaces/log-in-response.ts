import { User } from './user';

export interface LogInResponse {
    accessToken: string;
    authentication: object;
    user: User;
}
