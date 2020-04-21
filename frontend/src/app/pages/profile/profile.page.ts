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
    public deadline = new Date('6/30/2020');
    public deadlineMessage = `Profile info can be changed until ${this.deadline.toLocaleDateString()}`;
    public roomOptions: number[] = [];
    public interfaceOptions = {
        accommodation: {
            subHeader: `
                If you or your guests require accommodations, you will be asked to input the 
                total number of rooms that you require.
            `
        },
        totalRooms: {
            subHeader: `
                This will help us determine the total number of rooms to block for the wedding.
            `
        },
        transportation: {
            subHeader: `
                Select 'Yes' if you or your guests require transportation between the 
                hotel and church on the day of the wedding.
            `
        }
    }

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }
    public get disableInputs() { return Date.now() >= this.deadline.getTime(); }

    constructor(
        private popoverController: PopoverController,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle(this.user.name);
        for (let i = 1; i <= this.user.maxGuests; i++) {
            this.roomOptions.push(i);
        }
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

    public handleChangeRSVP(event) {
        console.log(event);
    }
}
