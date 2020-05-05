import { Component } from '@angular/core';
import { isUndefined, isEqual } from 'lodash';

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
    public readonly deadlineExpired = Date.now() >= deadline.getTime();

    public email: string;
    public guests: string[];
    public roomOptions: number[] = [];

    public changeEmailErrorMessage: string;
    public changeGuestsErrorMessage: string;

    public displayChangeEmail = false;
    public displayChangeGuests = false;
    public resendingEmailVerification = false;

    public isUpdating = {
        isAttending: false,
        requiresAccommodations: false,
        totalRequiredRooms: false,
        requiresTransportation: false,
        guests: false
    }

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
    public get isChangeEmailDisabled() { return this.user.email === this.email; }
    public get isChangeGuestsDisabled() { return isEqual(this.user.guests, this.guests) }
    public get isAddGuestsDisabled() { return this.user.guests.length === this.user.maxGuests; }
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
        this.guests = this.user.guests.slice();
        this.setRoomOptions();

        if (!history.state.doNotDisplayEmailVerificationWarning && !this.user.isEmailVerified) {
            this.utilsService.toast('warning', 'Email is not verified',
                'Please verify your email address to receive important wedding updates');
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

    public async updateColumn(column: string, value: any) {
        if (!isEqual(this.user[column], value)) {
            try {
                this.isUpdating[column] = true;
                await this.userService.update({ [column]: value });
                return true;
            } catch (error) {
                console.error(error);
                this.utilsService.toastBadRequest();
                return false;
            } finally {
                setTimeout(() => {
                    this.isUpdating[column] = false;
                }, 1000);
            }
        }
    }

    public async resendEmailVerification(email: string) {
        try {
            this.resendingEmailVerification = true;
            await this.userService.changeEmail(email);
            this.changeEmailErrorMessage = undefined;
            this.displayChangeEmail = false;
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

    public toggleDisplayChangeEmail() {
        this.email = this.user.email;
        this.changeEmailErrorMessage = undefined;
        this.displayChangeEmail = !this.displayChangeEmail;
    }

    public changeEmailKeyDown(event: KeyboardEvent) {
        this.changeEmailErrorMessage = undefined;

        if (event.key === 'Enter' && this.email !== this.user.email) {
            this.resendEmailVerification(this.email);
        }
    }

    public toggleDisplayChangeGuests() {
        this.changeGuestsErrorMessage = undefined;
        this.displayChangeGuests = !this.displayChangeGuests;
        this.guests.filter(guest => guest && guest.length > 0);
        this.user.guests = this.guests;
    }

    public async updateGuests() {
        if (await this.updateColumn('guests', this.guests)) {
            this.guests = this.user.guests.slice();
            this.toggleDisplayChangeGuests();
            this.setRoomOptions();
        }
    }

    public addGuest() {
        this.guests.push('');
    }

    public changeGuestsKeyDown(event: KeyboardEvent) {
        this.changeGuestsErrorMessage = undefined;

        if (event.key === 'Enter') {
            this.updateGuests();
        }
    }

    public changeGuestsTrackBy(index: any, item: any) {
        return index;
    }

    private setRoomOptions() {
        this.roomOptions = [];
        for (let i = 1; i <= this.user.guests.length; i++) {
            this.roomOptions.push(i);
        }
    }
}
