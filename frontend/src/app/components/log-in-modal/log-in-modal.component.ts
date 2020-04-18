import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService } from 'src/app/services/user/user.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in-modal.component.html',
    styleUrls: ['./log-in-modal.component.scss'],
})
export class LogInModalComponent {
    public username: string;
    public password: string;
    public errorMessage = 'Bad request';

    public isSubmitting = false;
    public hasError = false;

    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        private modalController: ModalController,
        private router: Router,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public dismiss() {
        this.modalController.dismiss();
    }

    public async submit() {
        this.hasError = false;
        this.isSubmitting = true;

        try {
            const user = await this.userService.logIn({ username: this.username, password: this.password });
            // const route = user.isAdmin ? '/users' : '/profile';
            this.router.navigate(['/profile']);
            this.dismiss();
        } catch (error) {
            console.error(error);
            this.hasError = true;
        } finally {
            this.isSubmitting = false;
        }
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
