import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private location: Location,
        private router: Router,
        private userService: UserService
    ) { }

    public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            if (this.userService.user) {
                return true;
            }

            await this.userService.logIn();
            return true;
        } catch (error) {
            await this.router.navigate(['/error', 401]);
            this.location.replaceState(state.url);
            return false;
        }
    }
}
