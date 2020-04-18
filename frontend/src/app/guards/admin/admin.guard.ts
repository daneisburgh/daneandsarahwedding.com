import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            const user = await this.userService.logIn();

            if (user.isAdmin) {
                return true;
            } else {
                this.utilsService.presentToast('danger', 'Unauthorized');
                this.router.navigate(['/']);
                return false;
            }
        } catch (error) {
            console.error(error);
            this.utilsService.presentToast('danger', 'Please log in');
            this.router.navigate(['/']);
            return false;
        }
    }
}
