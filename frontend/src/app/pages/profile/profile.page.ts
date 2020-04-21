import { Component } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { PopoverController } from '@ionic/angular';
import { DeadlinePopoverComponent } from './deadline-popover/deadline-popover.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    public deadlineMessage = `Profile info can be changed until 6/30/2020`;

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        private popoverController: PopoverController,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle(this.user.name);
    }

    public async presentDeadlinePopover(event: any) {
        const cssClass = 'deadline-popover';
        (await this.popoverController.create({
            event,
            cssClass,
            component: DeadlinePopoverComponent,
            componentProps: { deadlineMessage: this.deadlineMessage }
        })).present();
    }
}
