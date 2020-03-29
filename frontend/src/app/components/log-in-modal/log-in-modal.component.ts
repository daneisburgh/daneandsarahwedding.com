import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { LogInResponse } from 'src/app/interfaces/log-in-response';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in-modal.component.html',
    styleUrls: ['./log-in-modal.component.scss'],
})
export class LogInModalComponent {
    private readonly badRequest = 'Bad request';
    private readonly invalidLogin = 'Invalid login';

    public username: string;
    public password: string;
    public errorMessage = this.badRequest;

    public isSubmitting = false;
    public hasError = false;

    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        private authService: AuthService,
        private modalController: ModalController,
        private router: Router,
        private utilsService: UtilsService
    ) { }

    public dismiss() {
        this.modalController.dismiss();
    }

    public submit() {
        this.isSubmitting = true;

        this.authService.logIn({
            strategy: 'local',
            username: this.username,
            password: this.password
        })
            .then((response: LogInResponse) => {
                const user = response.user;
                const route = user.permissions.includes('admin') ? '/users' : '/profile';

                this.hasError = false;
                this.utilsService.setUser(user);
                this.router.navigate([route]);
                this.dismiss();
            })
            .catch((error: any) => {
                console.error(error);
                this.hasError = true;
                this.errorMessage = error.message === this.invalidLogin ? this.invalidLogin : this.badRequest;
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }

    public keyDown(event: KeyboardEvent) {
        this.hasError = false;

        if (event.key === 'Enter') {
            this.submit();
        }
    }

    public presentResetPasswordModal() {

    }
}
