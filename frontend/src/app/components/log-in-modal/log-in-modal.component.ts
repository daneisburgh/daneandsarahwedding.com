import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { EmailResetModalComponent } from '../email-reset-modal/email-reset-modal.component';

const loginErrors = [
    'Invalid Username',
    'Invalid Password'
];

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in-modal.component.html',
    styleUrls: ['./log-in-modal.component.scss'],
})
export class LogInModalComponent {
    public username: string;
    public password: string;
    public errorMessage: string;

    public isSubmitting = false;
    public hasError = false;

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }

    private modal: HTMLIonModalElement;

    constructor(
        private modalController: ModalController,
        private router: Router,
        private userService: UserService,
        private utilsService: UtilsService
    ) {
        this.getModal();
    }

    public dismiss() {
        this.modal.dismiss();
    }

    public async submit() {
        this.hasError = false;
        this.isSubmitting = true;

        try {
            await this.userService.logIn({ username: this.username, password: this.password });

            if (this.user.email) {
                const route = this.user.isAdmin ? '/users' : '/profile';
                await this.router.navigate([route]);
            } else {
                await this.utilsService.presentToast('danger', 'Please add an email to continue');
                const modal = await this.modalController.create({ component: EmailResetModalComponent });
                await modal.present();
                await modal.onWillDismiss();
                this.dismiss();
            }
        } catch (error) {
            this.hasError = true;
            this.errorMessage = loginErrors.includes(error.error) ? error.error : 'Bad Request';
        } finally {
            setTimeout(() => {
                this.isSubmitting = false;
            }, 1000);
        }
    }

    public keyDown(event: KeyboardEvent) {
        this.hasError = false;

        if (event.key === 'Enter') {
            this.submit();
        }
    }

    public presentResetPasswordModal() { }

    private async getModal() {
        this.modal = await this.modalController.getTop();
    }
}
