import { Component } from '@angular/core';
import { isUndefined } from 'lodash';

import { UserService, CHANGE_EMAIL_ERRORS } from '../../shared/services/user/user.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
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
    public readonly deadlineMessage = `Profile info can be updated until ${deadlineString}`;
    public roomOptions: number[] = [];
    public email: string = '';
    public changeEmailErrorMessage: string;

    public displayChangeEmail = false;
    public updatingIsAttending = false;
    public updatingRequiresAccommodations = false;
    public updatingRequiresTransportation = false;
    public resendingEmailVerification = false;

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
    public get emailVerificationHasExpired() {
        return this.user.emailVerificationExpiration &&
            this.user.emailVerificationExpiration < new Date()
    }

    constructor(
        private popoverController: PopoverController,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle(this.user.name);

        if (!history.state.doNotDisplayEmailVerificationWarning && !this.user.isEmailVerified) {
            this.utilsService.toast('warning', 'Email address is not verified',
                'Please verify your email address to receive important wedding updates');
        }

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
            await this.userService.update({ isAttending: event.detail.value });
        } catch (error) {
            console.error(error);
            this.utilsService.toastBadRequest();
        } finally {
            setTimeout(() => {
                this.updatingIsAttending = false;
            }, 1000);
        }
    }

    public async handleUpdateRequiresAccommodations(event: CustomEvent) {
        try {
            this.updatingRequiresAccommodations = true;
            await this.userService.update({ requiresAccommodations: event.detail.value });
        } catch (error) {
            console.error(error);
            this.utilsService.toastBadRequest();
        } finally {
            setTimeout(() => {
                this.updatingRequiresAccommodations = false;
            }, 1000);
        }
    }

    public async resendEmailVerification(email?: string) {
        try {
            this.resendingEmailVerification = true;

            if (email === this.user.email) {
                throw { error: 'Email not changed' };
            } else {
                await this.userService.changeEmail(isUndefined(email) ? this.user.email : email);
                this.changeEmailErrorMessage = undefined;
                this.displayChangeEmail = false;
                this.email = '';
            }
        } catch (error) {
            console.error(error);

            if (this.displayChangeEmail && CHANGE_EMAIL_ERRORS.includes(error.error)) {
                this.changeEmailErrorMessage = error.error;
            } else {
                this.utilsService.toastBadRequest();
            }
        } finally {
            setTimeout(() => {
                this.resendingEmailVerification = false;
            }, 1000);
        }
    }

    public changeEmailKeyDown(event: KeyboardEvent) {
        this.changeEmailErrorMessage = undefined;

        if (event.key === 'Enter') {
            this.resendEmailVerification(this.email);
        }
    }

    public toggleDisplayChangeEmail() {
        this.email = '';
        this.changeEmailErrorMessage = undefined;
        this.displayChangeEmail = !this.displayChangeEmail;
    }
}
