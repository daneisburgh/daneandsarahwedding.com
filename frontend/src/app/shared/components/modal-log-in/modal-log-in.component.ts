import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ModalChangeEmailComponent } from '../modal-change-email/modal-change-email.component';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';
import { UserService, LOG_IN_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-modal-log-in',
    templateUrl: './modal-log-in.component.html',
    styleUrls: ['./modal-log-in.component.scss'],
})
export class ModalLogInComponent {
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
        this.setModal();
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
                    component: ModalChangeEmailComponent,
                    cssClass: 'app-modal-change-email add-email'
                });
                await changeEmailModal.present();
                await changeEmailModal.onWillDismiss();
            }

            this.modal.dismiss();
        } catch (error) {
            console.error(error);
            this.errorMessage = LOG_IN_ERRORS.includes(error.error) ? error.error : 'Bad request';
        } finally {
            this.isSubmitting = false;
        }
    }

    public keyDown(event: KeyboardEvent) {
        this.errorMessage = undefined;

        if (event.key === 'Enter') {
            this.submit();
        }
    }

    public async presentResetPasswordModal() {
        const resetPasswordModal = await this.modalController.create({
            component: ModalChangePasswordComponent,
            cssClass: 'app-modal-change-password send-email'
        });
        await resetPasswordModal.present();
        await resetPasswordModal.onWillDismiss();
        this.modal.dismiss();
    }

    private async setModal() {
        this.modal = await this.modalController.getTop();
    }
}
