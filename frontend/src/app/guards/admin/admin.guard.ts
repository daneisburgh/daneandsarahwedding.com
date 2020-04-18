import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private location: Location,
        private router: Router,
        private userService: UserService
    ) { }

    public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            await this.userService.logIn();

            if (!this.userService.user.isAdmin) {
                throw new Error();
            }

            return true;
        } catch (error) {
            console.error(error);
            await this.router.navigate(['/error', 401]);
            this.location.replaceState(state.url);
            return false;
        }
    }
}
