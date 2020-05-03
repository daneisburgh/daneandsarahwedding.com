import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { UserService } from '../../services/user/user.service';


@Component({
    selector: 'app-popover-profile-links',
    templateUrl: './popover-profile-links.component.html',
    styleUrls: ['./popover-profile-links.component.scss'],
})
export class PopoverProfileLinksComponent {
    constructor(
        public popoverController: PopoverController,
        private userService: UserService
    ) { }

    public logOut() {
        this.userService.logOut();
        this.popoverController.dismiss();
    }
}
