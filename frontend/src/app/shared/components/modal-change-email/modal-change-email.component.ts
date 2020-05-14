import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService, CHANGE_EMAIL_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-modal-change-email',
    templateUrl: './modal-change-email.component.html',
    styleUrls: ['./modal-change-email.component.scss'],
})
export class ModalChangeEmailComponent {
    public email: string;
    public errorMessage: string;
    public isSubmitting = false;

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }
    public get title() { return this.user.email ? 'Change Email' : 'Add Email'; }

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
            await this.userService.changeEmail(this.email);
            await this.router.navigate(['/profile'], { state: { doNotDisplayEmailVerificationWarning: true } });
            this.dismiss();
        } catch (error) {
            console.error(error);
            this.errorMessage = CHANGE_EMAIL_ERRORS.includes(error.error) ? error.error : 'Bad request';
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
