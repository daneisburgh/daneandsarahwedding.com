import { Component } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { PopoverController } from '@ionic/angular';
import { DeadlinePopoverComponent } from './deadline-popover/deadline-popover.component';

const deadline = new Date('6/30/2020');
export const deadlineString = deadline.toLocaleDateString();

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    public deadlineMessage = `Profile info can be updated until ${deadlineString}`;
    public roomOptions: number[] = [];

    public updatingIsAttending = false;
    public updatingRequiresAccommodations = false;
    public updatingRequiresTransportation = false;

    public interfaceOptions = {
        accommodation: {
            subHeader: `
                Select 'Yes' if you or your guests require accommodations anytime between October 22nd to the 25th.
            `
        },
        totalRooms: {
            subHeader: `
                This will help us determine the total number of rooms to block for the wedding.
            `
        },
        transportation: {
            subHeader: `
                Select 'Yes' only if you or your guests require transportation between the hotel and church on the day
                of the wedding.  Note that the hotel will provide transportation to and from the airport.
            `
        }
    }

    public get user() { return this.userService.user; }
    public get isMobile() { return this.utilsService.isMobile; }
    public get disableInputs() { return Date.now() >= deadline.getTime(); }

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

    public async handleUpdateIsAttending(event: CustomEvent) {
        try {
            this.updatingIsAttending = true;
            this.user.isAttending = event.detail.value;
            await this.userService.update();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                this.updatingIsAttending = false;
            }, 1000);
        }
    }

    public async handleUpdateRequiresAccommodations(event: CustomEvent) {
        try {
            this.updatingRequiresAccommodations = true;
            this.user.requiresAccommodations = event.detail.value;
            await this.userService.update();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                this.updatingRequiresAccommodations = false;
            }, 1000);
        }
    }
}
