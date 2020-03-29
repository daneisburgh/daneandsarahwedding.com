import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { UtilsService } from '../..//services/utils/utils.service';


@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private utilsService: UtilsService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService
            .logIn()
            .then(() => true)
            .catch(() => {
                this.utilsService.presentToast('danger', 'Please log in to view content');
                this.router.navigate(['/']);
                return false;
            });
    }
}
