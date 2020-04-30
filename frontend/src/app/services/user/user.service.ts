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
                const token = await this.storage.get(TOKEN_KEY);

                if (!token) {
                    throw new Error('Missing log in body and token');
                }

                body = { token };
            }

            const url = `${environment.apiUrl}/login`;
            const response = await this.httpClient.post<LogInResponse>(url, body).toPromise();

            await this.storage.set(TOKEN_KEY, response.token);
            this.user = response.user;
        } catch (error) {
            await this.storage.remove(TOKEN_KEY);
            throw error;
        }
    }

    public async logOut() {
        if (['/profile', '/users'].includes(this.router.url)) {
            await this.router.navigate(['/']);
        }

        await this.storage.remove(TOKEN_KEY);
        this.user = undefined;
    }

    public async update() {
        await this.httpClient.post(`${environment.apiUrl}/user-profile-update`, {
            token: await this.storage.get(TOKEN_KEY),
            updatedUser: this.user
        }).toPromise();
    }

    public async changeEmail(email: string) {
        await this.httpClient.post(`${environment.apiUrl}/user-change-email`, {
            token: await this.storage.get(TOKEN_KEY),
            email
        }).toPromise();
    }
}
