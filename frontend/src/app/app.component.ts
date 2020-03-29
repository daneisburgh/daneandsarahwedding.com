import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { GalleryPopoverComponent } from './components/gallery-popover/gallery-popover.component';
import { LogInModalComponent } from './components/log-in-modal/log-in-modal.component';
import { UtilsService } from './services/utils/utils.service';
import { AuthService } from './services/auth/auth.service';
import { LogInResponse } from './interfaces/log-in-response';
import { User } from './interfaces/user';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public readonly currentYear = new Date().getFullYear();

    public get user(): User { return this.utilsService.user; }
    public get userIsAdmin(): boolean { return this.user.permissions.includes('admin'); }
    public get isMobile(): boolean { return this.utilsService.isMobile; }
    public get appTitle(): string { return this.utilsService.appTitle; }
    public get logInOutButtonFill(): string { return this.utilsService.isMobile ? 'clear' : 'outline'; }

    constructor(
        public router: Router,
        private authService: AuthService,
        private modalController: ModalController,
        private platform: Platform,
        private popoverController: PopoverController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private utilsService: UtilsService) {
        this.initializeApp();
        this.logIn();
    }

    public logOut() {
        this.authService.logOut();
        this.utilsService.clearUser();
    }

    public async presentLogInModal() {
        await (await this.modalController.create({ component: LogInModalComponent })).present();
    }

    public async presentGalleryOptions(event: MouseEvent) {
        const popover = await this.popoverController.create({
            component: GalleryPopoverComponent,
            event
        });

        return await popover.present();
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
        });
    }

    private async logIn() {
        try {
            const response: LogInResponse = await this.authService.logIn();
            this.utilsService.setUser(response.user);
        } catch { }
    }
}
