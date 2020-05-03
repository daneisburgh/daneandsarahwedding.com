import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService, CHANGE_PASSWORD_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-modal-change-password',
    templateUrl: './modal-change-password.component.html',
    styleUrls: ['./modal-change-password.component.scss'],
})
export class ModalChangePasswordComponent {
    @Input()
    public token: string;

    public email: string;
    public errorMessage: string;
    public isSubmitting = false;

    public get isMobile() { return this.utilsService.isMobile; }
    public get title() { return this.token ? 'Reset Password' : 'Input Email'; }

    private modal: HTMLIonModalElement;

    constructor(
        private modalController: ModalController,
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
            await this.userService.passwordEmail(this.email);
            this.dismiss();
        } catch (error) {
            console.error(error);
            this.errorMessage = CHANGE_PASSWORD_ERRORS.includes(error.error) ? error.error : 'Bad request';
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

    private async setModal() {
        this.modal = await this.modalController.getTop();
    }
}
