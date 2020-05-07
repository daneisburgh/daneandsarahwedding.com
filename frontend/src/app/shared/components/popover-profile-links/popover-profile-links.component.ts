import { Component } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';

import { UserService } from '../../services/user/user.service';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';


@Component({
    selector: 'app-popover-profile-links',
    templateUrl: './popover-profile-links.component.html',
    styleUrls: ['./popover-profile-links.component.scss'],
})
export class PopoverProfileLinksComponent {
    constructor(
        private modalController: ModalController,
        private popoverController: PopoverController,
        private userService: UserService
    ) { }

    public dismiss() {
        this.popoverController.dismiss();
    }

    public async changePassword() {
        (await this.modalController.create({
            component: ModalChangePasswordComponent,
            cssClass: 'app-modal-change-password send-email'
        })).present();
        this.dismiss();
    }

    public logOut() {
        this.userService.logOut();
        this.dismiss();
    }
}
