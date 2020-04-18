import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { GalleryPopoverComponent } from './components/gallery-popover/gallery-popover.component';
import { LogInModalComponent } from './components/log-in-modal/log-in-modal.component';
import { UserService } from './services/user/user.service';
import { UtilsService } from './services/utils/utils.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public readonly currentYear = new Date().getFullYear();

    public get user() { return this.userService.user; }
    public get appTitle(): string { return this.utilsService.appTitle };
    public get isMobile(): boolean { return this.utilsService.isMobile; }
    public get logInOutButtonFill(): string { return this.utilsService.isMobile ? 'clear' : 'outline'; }

    constructor(
        public router: Router,
        private modalController: ModalController,
        private platform: Platform,
        private popoverController: PopoverController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserService,
        private utilsService: UtilsService) {
        this.userService.logIn().catch(_ => {});
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
        });
    }

    public logOut() {
        this.userService.logOut();
    }

    public async presentLogInModal() {
        (await this.modalController.create({ component: LogInModalComponent })).present();
    }

    public async presentGalleryPopover(event: any) {
        (await this.popoverController.create({ event, component: GalleryPopoverComponent })).present();
    }
}
