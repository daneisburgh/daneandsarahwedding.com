import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../utils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router,
        private utilsService: UtilsService
    ) { }

    public logIn(credentials?: any): Promise<any> {
        return Promise.resolve();
    }

    public logOut() {
        if (!['/home', '/info', '/about-us'].includes(this.router.url)) {
            this.router.navigate(['/']);
        }
    }
}
