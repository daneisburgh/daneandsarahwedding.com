import { Component } from '@angular/core';
import { isEqual } from 'lodash';

import { UserService, CHANGE_EMAIL_ERRORS } from '../../shared/services/user/user.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { PopoverController } from '@ionic/angular';
import { DeadlinePopoverComponent } from './deadline-popover/deadline-popover.component';

const deadline = new Date('6/30/2020');
export const deadlineString = deadline.toLocaleDateString();

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss', './profile.fireworks.scss'],
})
export class ProfilePage {
    public readonly deadlineMessage = `Profile info can be updated until ${deadlineString}`;

    public email: string;
    public guests: string[];

    public changeEmailErrorMessage: string;
    public changeGuestsErrorMessage: string;

    public displayFireworks = false;
    public displayChangeEmail = false;
    public displayChangeGuests = false;
    public isResendingEmailVerification = false;
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
    public get filteredGuests() { return this.guests.filter(guest => guest.length > 0); }

    public get isDeadlineExpired() { return Date.now() >= deadline.getTime(); }
    public get isInputDisabled() { return this.isDeadlineExpired || !this.user.isAttending; }
    public get isRequiredRoomsAndTransportationDisabled() { return this.isInputDisabled || !this.user.requiresAccommodations; }
    public get isChangeEmailDisabled() { return this.user.email === this.email; }
    public get isChangeGuestsDisabled() {
        const primaryGuestRemoved = this.guests.filter((guest, index) => guest.length > 0 && index <= this.user.minGuests).length === 0;
        return primaryGuestRemoved || isEqual(this.user.guests, this.filteredGuests);
    }

    public get canAddOrRemoveGuests() { return this.user.minGuests < this.user.maxGuests; }
    public get addOrRemoveString() { return `/${this.user.guests.length < this.user.maxGuests ? 'Add' : 'Remove'}`; }

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

        this.displayFireworks = false;
        this.displayChangeEmail = false;
        this.displayChangeGuests = false;
        this.isResendingEmailVerification = false;
        this.isUpdating = {
            isAttending: false,
            requiresAccommodations: false,
            totalRequiredRooms: false,
            requiresTransportation: false,
            guests: false
        }

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

                if (column === 'isAttending' && this.user.isAttending) {
                    this.displayFireworks = true;
                    this.utilsService.toast('success', 'Yay!', 'We look forward to seeing you at the wedding this October');
                }

                return true;
            } catch (error) {
                console.error(error);
                this.utilsService.toastBadRequest();
                return false;
            } finally {
                setTimeout(() => {
                    this.isUpdating[column] = false;

                    setTimeout(() => {
                        this.displayFireworks = false;
                    }, 5000);
                }, 1000);
            }
        }
    }

    public async resendEmailVerification(email: string) {
        try {
            this.isResendingEmailVerification = true;
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
                this.isResendingEmailVerification = false;
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

        if (event.key === 'Enter' && !this.isChangeEmailDisabled) {
            this.resendEmailVerification(this.email);
        }
    }

    public toggleDisplayChangeGuests() {
        this.guests = this.user.guests.slice();
        this.changeGuestsErrorMessage = undefined;
        this.displayChangeGuests = !this.displayChangeGuests;
    }

    public async updateGuests() {
        if (await this.updateColumn('guests', this.filteredGuests)) {
            this.toggleDisplayChangeGuests();
        }
    }

    public addGuest() {
        this.guests.push('');
    }

    public removeGuest(index: number) {
        this.guests.splice(index, 1);
    }

    public changeGuestsKeyDown(event: KeyboardEvent) {
        this.changeGuestsErrorMessage = undefined;

        if (event.key === 'Enter' && !this.isChangeGuestsDisabled) {
            this.updateGuests();
        }
    }

    public changeGuestsTrackBy(index: any, item: any) {
        return index;
    }
}
