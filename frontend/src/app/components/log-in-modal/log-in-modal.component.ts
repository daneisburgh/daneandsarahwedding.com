import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService, LOG_IN_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { ChangeEmailModalComponent } from '../change-email-modal/change-email-modal.component';

@Component({
    selector: 'app-log-in-modal',
    templateUrl: './log-in-modal.component.html',
    styleUrls: ['./log-in-modal.component.scss'],
})
export class LogInModalComponent {
    public username: string;
    public password: string;
    public errorMessage: string;
    public isSubmitting = false;

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
        this.isSubmitting = true;
        this.errorMessage = undefined;

        try {
            await this.userService.logIn({ username: this.username, password: this.password });

            if (this.user.email) {
                await this.router.navigate(['/profile']);
            } else {
                const changeEmailModal = await this.modalController.create({
                    component: ChangeEmailModalComponent,
                    cssClass: 'app-change-email-modal add-email'
                });
                await changeEmailModal.present();
                await changeEmailModal.onWillDismiss();
            }

            this.modal.dismiss();
        } catch (error) {
            console.error(error);
            this.errorMessage = LOG_IN_ERRORS.includes(error.error) ? error.error : 'Bad request';
        } finally {
            setTimeout(() => {
                this.isSubmitting = false;
            }, 1000);
        }
    }

    public keyDown(event: KeyboardEvent) {
        this.errorMessage = undefined;

        if (event.key === 'Enter') {
            this.submit();
        }
    }

    public presentResetPasswordModal() { }

    private async getModal() {
        this.modal = await this.modalController.getTop();
    }
}
