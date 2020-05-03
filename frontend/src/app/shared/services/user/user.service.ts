import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { UtilsService } from '../utils/utils.service';
import { environment } from '../../../../environments/environment';

interface User {
    username: string;
    name: string;
    address: string;
    email: string;
    emailVerificationExpiration: Date;
    isEmailVerified: boolean;
    guests: string[];
    maxGuests: number;
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

export const LOG_IN_ERRORS = ['Invalid username', 'Invalid password'];
export const VERIFY_EMAIL_ERRORS = ['Invalid link', 'Link expired'];
export const CHANGE_EMAIL_ERRORS = ['Invalid email', 'Email not changed', 'Email is taken'];
export const CHANGE_PASSWORD_ERRORS = ['Invalid email', 'Email not verified'];

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
        await this.apiPost('user-change-email', { email });
        this.utilsService.toast('success', 'Email verification sent',
            'Please check your inbox and spam folders for an email with a link to verify your email address');
    }

    public async passwordEmail(email: string) {
        await this.apiPost('user-password-email', { email });
        this.utilsService.toast('success', 'Password change email sent',
            'Please check your inbox and spam folders for an email with a link to change your password');
    }

    public async verifyEmail(emailVerificationCode: string) {
        try {
            await this.apiPost('user-verify-email', { emailVerificationCode });
            this.utilsService.toast('success', 'Email verified', 'Thank you for verifying your email');
        } catch (error) {
            console.error(error);

            if (VERIFY_EMAIL_ERRORS.includes(error.error)) {
                this.utilsService.toast('error', error.error, 'Please resend email verification link from your profile');
            } else {
                this.utilsService.toastBadRequest();
            }
        } finally {
            this.router.navigate([(this.user ? '/profile' : '/home')]);
        }
    }
}
