import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as querystring from 'querystring';


import { ModalChangePasswordComponent } from './shared/components/modal-change-password/modal-change-password.component';
import { ModalLogInComponent } from './shared/components/modal-log-in/modal-log-in.component';
import { PopoverGalleryLinksComponent } from './shared/components/popover-gallery-links/popover-gallery-links.component';
import { PopoverProfileLinksComponent } from './shared/components/popover-profile-links/popover-profile-links.component';
import { UserService, CHANGE_PASSWORD_ERRORS } from './shared/services/user/user.service';
import { UtilsService } from './shared/services/utils/utils.service';

export const emailUrl = 'mailto:hello@daneandsarahwedding.com';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit {
    public isReady = false;
    public readonly currentYear = new Date().getFullYear();
    public readonly registryUrl = 'https://www.zola.com/registry/daneandsarahwedding';
    public readonly emailUrl = emailUrl;

    public get user() { return this.userService.user; }
    public get appTitle() { return this.utilsService.appTitle };
    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        @Inject(DOCUMENT) document,
        public router: Router,
        private modalController: ModalController,
        private platform: Platform,
        private popoverController: PopoverController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserService,
        private utilsService: UtilsService) { }

    public ngAfterViewInit() {
        this.initializeApp();
    }

    public async presentGalleryPopover(event: any) {
        const cssClass = 'gallery-popover';
        (await this.popoverController.create({ event, cssClass, component: PopoverGalleryLinksComponent })).present();
    }

    public async presentProfilePopover(event: any) {
        const cssClass = 'profile-popover';
        (await this.popoverController.create({ event, cssClass, component: PopoverProfileLinksComponent })).present();
    }

    public async presentLogInModal() {
        (await this.modalController.create({
            component: ModalLogInComponent,
            cssClass: 'app-modal-log-in'
        })).present();
    }

    private async initializeApp() {
        this.utilsService.setTitle('Loading...');

        await this.userService.logIn().catch(() => { });

        if (this.user && !this.user.email) {
            await this.userService.logOut();
        }

        await this.platform.ready();
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        const { emailVerificationCode, passwordChangeCode } = querystring.parse(window.location.search.replace('?', ''));

        if (emailVerificationCode) {
            await this.userService.verifyEmail(emailVerificationCode as string);
            await this.dismissLoading();
        } else if (passwordChangeCode) {
            try {
                await this.userService.changePassword(passwordChangeCode as string);
            } catch (error) {
                if (CHANGE_PASSWORD_ERRORS.includes(error.error)) {
                    await this.dismissLoading();
                    this.utilsService.toast('error', error.error, 'Please resubmit change password request from login');
                } else {
                    await this.dismissLoading();
                    await (await this.modalController.create({
                        component: ModalChangePasswordComponent,
                        componentProps: { code: passwordChangeCode },
                        cssClass: 'app-modal-change-password'
                    })).present();
                }
            }

            await this.router.navigate(['/home']);
        } else {
            await this.dismissLoading();
        }
    }

    private async dismissLoading() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        document.getElementById('loadingElement').style.display = 'none';
        this.isReady = true;
    }
}
