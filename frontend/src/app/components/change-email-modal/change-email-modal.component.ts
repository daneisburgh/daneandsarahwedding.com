import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-change-email-modal',
    templateUrl: './change-email-modal.component.html',
    styleUrls: ['./change-email-modal.component.scss'],
})
export class ChangeEmailModalComponent {
    public email: string;
    public errorMessage: string;

    public isSubmitting = false;
    public hasError = false;

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }
    public get title() { return this.user.email ? 'Change Email' : 'Add Email'; }

    private modal: HTMLIonModalElement;

    constructor(
        private modalController: ModalController,
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
        } catch (error) {
            this.hasError = true;
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

    private async getModal() {
        this.modal = await this.modalController.getTop();
    }
}
