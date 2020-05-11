import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { UserService, PASSWORD_EMAIL_ERRORS } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';


@Component({
    selector: 'app-popover-profile-links',
    templateUrl: './popover-profile-links.component.html',
    styleUrls: ['./popover-profile-links.component.scss'],
})
export class PopoverProfileLinksComponent {
    constructor(
        private popoverController: PopoverController,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public dismiss() {
        this.popoverController.dismiss();
    }

    public async changePassword() {
        try {
            await this.userService.changePasswordEmail(this.userService.user.email);
        } catch (error) {
            if (PASSWORD_EMAIL_ERRORS.includes(error.error)) {
                this.utilsService.toast('error', error.error, 'Please verify email and/or submit new request, and contact us if the error persists');
            } else {
                this.utilsService.toastBadRequest();
            }
        } finally {
            this.dismiss();
        }
    }

    public logOut() {
        this.userService.logOut();
        this.dismiss();
    }
}
