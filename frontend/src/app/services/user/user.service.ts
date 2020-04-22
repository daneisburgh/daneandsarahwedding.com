import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { environment } from '../../../environments/environment';

interface User {
    username: string;
    name: string;
    address: string;
    email: string;
    isEmailConfirmed: boolean;
    guests: string[];
    maxGuests: number;
    isAdmin: boolean;
    isAttending: boolean;
    requiresAccommodations: boolean;
    totalRequiredRooms: number
    requiresTransportation: boolean;
}

interface LogInResponse {
    user: User,
    token: string
}

const TOKEN_KEY = 'userJWT';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public user: User;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private storage: Storage
    ) { }

    public async logIn(body?: object) {
        try {
            if (!body) {
                body = { token: await this.storage.get(TOKEN_KEY) };
            }

            const url = `${environment.apiUrl}/login`;
            console.log('REQUEST logIn', url, body)
            const response = await this.httpClient.post<LogInResponse>(url, body).toPromise();
            console.log('RESPONSE logIn', response);

            await this.storage.set(TOKEN_KEY, response.token);
            this.user = response.user;
        } catch (error) {
            await this.storage.remove(TOKEN_KEY);
            console.error(error);
            throw error;
        }
    }

    public async logOut() {
        if (['/profile', '/users'].includes(this.router.url)) {
            await this.router.navigate(['/']);
        }

        await this.storage.set(TOKEN_KEY, undefined);
        this.user = undefined;
    }

    public async update() {
        const url = `${environment.apiUrl}/update`;
        const body = { token: await this.storage.get(TOKEN_KEY), user: this.user };
        console.log('REQUEST update', url, body);
        await this.httpClient.post(url, body).toPromise();
    }
}
