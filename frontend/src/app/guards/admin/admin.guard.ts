import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { UtilsService } from '../..//services/utils/utils.service';
import { LogInResponse } from '../../interfaces/log-in-response';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private utilsService: UtilsService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService
            .logIn()
            .then((response: LogInResponse) => {
                return response.user.permissions.includes('admin');
            })
            .catch(() => {
                this.utilsService.presentToast('danger', 'Please log in to view content');
                this.router.navigate(['/']);
                return false;
            });
    }
}
