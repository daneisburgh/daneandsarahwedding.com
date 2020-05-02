import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as querystring from 'querystring';

import { GalleryPopoverComponent } from './components/gallery-popover/gallery-popover.component';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
import { LogInModalComponent } from './components/log-in-modal/log-in-modal.component';
import { UserService } from './services/user/user.service';
import { UtilsService } from './services/utils/utils.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public isReady = false;
    public readonly currentYear = new Date().getFullYear();

    public get user() { return this.userService.user; }
    public get appTitle() { return this.utilsService.appTitle };
    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        public router: Router,
        private modalController: ModalController,
        private platform: Platform,
        private popoverController: PopoverController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserService,
        private utilsService: UtilsService) {
        this.initializeApp();
    }

    public async presentGalleryPopover(event: any) {
        const cssClass = 'gallery-popover';
        (await this.popoverController.create({ event, cssClass, component: GalleryPopoverComponent })).present();
    }

    public async presentProfilePopover(event: any) {
        const cssClass = 'profile-popover';
        (await this.popoverController.create({ event, cssClass, component: ProfilePopoverComponent })).present();
    }

    public async presentLogInModal() {
        (await this.modalController.create({
            component: LogInModalComponent,
            cssClass: 'app-log-in-modal'
        })).present();
    }

    private async initializeApp() {
        await this.userService.logIn().catch(() => { });

        if (this.user && !this.user.email) {
            await this.userService.logOut();
        }

        await this.platform.ready();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.isReady = true;

        const { emailVerificationCode } = querystring.parse(window.location.search.replace('?', ''));

        if (emailVerificationCode) {
            await this.userService.verifyEmail(emailVerificationCode as string);
        }
    }
}
