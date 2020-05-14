import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService, PASSWORD_EMAIL_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-modal-change-password',
    templateUrl: './modal-change-password.component.html',
    styleUrls: ['./modal-change-password.component.scss'],
})
export class ModalChangePasswordComponent {
    @Input()
    public code: string;

    public email: string;
    public newPassword: string;
    public confirmPassword: string;
    public errorMessage: string;
    public isSubmitting = false;

    public get isMobile() { return this.utilsService.isMobile; }
    public get title() { return this.code ? 'Change Password' : 'Input Email'; }

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
        this.errorMessage = undefined;
        this.isSubmitting = true;

        try {
            if (this.code) {
                if (this.newPassword !== this.confirmPassword) {
                    this.errorMessage = 'Passwords do not match';
                } else {
                    await this.userService.changePassword(this.code, this.newPassword);
                    this.utilsService.toast('success', 'Successfully changed password',
                        'Please remember to use your new password on your next log in');
                    await this.router.navigate(['/profile']);
                    this.dismiss();
                }
            } else {
                await this.userService.changePasswordEmail(this.email);
                this.dismiss();
            }
        } catch (error) {
            console.error(error);
            this.errorMessage = error.error === 'Invalid password' ||
                PASSWORD_EMAIL_ERRORS.includes(error.error) ? error.error : 'Bad request';
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

    private async setModal() {
        this.modal = await this.modalController.getTop();
    }
}
