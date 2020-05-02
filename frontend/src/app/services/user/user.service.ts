import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { UtilsService } from '../utils/utils.service';
import { environment } from '../../../environments/environment';

interface User {
    username: string;
    name: string;
    address: string;
    email: string;
    emailVerificationExpiration: Date;
    isEmailVerified: boolean;
    guests: string[];
    maxGuests: number;
    isAdmin: boolean;
    isAttending: boolean;
    requiresAccommodations: boolean;
    totalRequiredRooms: number
    requiresTransportation: boolean;
}

interface UserResponse {
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
        private storage: Storage,
        private utilsService: UtilsService
    ) { }

    private async apiPost(route: string, body: object) {
        try {
            console.log('REQUEST', route, body);
            body = { ...body, token: await this.storage.get(TOKEN_KEY) };
            const response = await this.httpClient.post<UserResponse>(`${environment.apiUrl}/${route}`, body).toPromise();
            console.log('RESPONSE', route, response);
            await this.storage.set(TOKEN_KEY, response.token);
            this.user = response.user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async logIn(credentials?: object) {
        await this.apiPost('login', credentials);
    }

    public async logOut() {
        if (['/profile', '/users'].includes(this.router.url)) {
            await this.router.navigate(['/']);
        }

        await this.storage.remove(TOKEN_KEY);
        this.user = undefined;
    }

    public async update(updatedColumns: object) {
        await this.apiPost('user-profile-update', { updatedColumns });
    }

    public async changeEmail(email: string) {
        await this.apiPost('user-email-change', { email });
        this.utilsService.presentToast('success', `Email verification sent!`);
    }

    public async verifyEmail(emailVerificationCode: string) {
        try {
            await this.apiPost('user-email-verify', { emailVerificationCode });
            this.utilsService.presentToast('success', 'Thank you for verifying your email address!');
        } catch (error) {
            console.error(error);
            const errors = [
                'Email verification link is invalid',
                'Email verification link has expired'
            ];
            const message = errors.includes(error.error) ? error.error : 'Bad Request';
            this.utilsService.presentToast('danger', message);
        } finally {
            this.router.navigate([(this.user ? '/profile' : '/home')]);
        }
    }
}
