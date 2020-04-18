import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            await this.userService.logIn();
            return true;
        } catch (error) {
            console.error(error);
            this.utilsService.presentToast('danger', 'Please log in');
            this.router.navigate(['/']);
            return false;
        }
    }
}
