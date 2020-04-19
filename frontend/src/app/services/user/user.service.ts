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
	isGoing: boolean;
	needsTransportation: boolean;
}

interface Credentials {
	username?: string;
	password?: string;
	token?: string;
}

interface LogInResponse {
	user: User,
	token: string
}

const TOKEN = 'userJWT';

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

	public async logIn(credentials?: Credentials) {
		if (!credentials) {
			credentials = { token: await this.storage.get(TOKEN) };
		}

		const response: LogInResponse = await this.httpClient
			.post<LogInResponse>(`${environment.apiUrl}/login`, credentials)
			.toPromise();

		this.user = response.user;
		await this.storage.set(TOKEN, response.token);
	}

	public async logOut() {
		await this.storage.set(TOKEN, undefined);

		if (['/profile', '/users'].includes(this.router.url)) {
			await this.router.navigate(['/']);
		}

		this.user = undefined;
	}
}
