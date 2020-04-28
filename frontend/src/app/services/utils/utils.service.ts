import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ToastOptions } from '@ionic/core';
import { MenuController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    public readonly appTitle = 'D&S Wedding';

    public readonly galleryData = [
        { name: 'engagement', title: 'Engagement', date: '10/2019' },
        { name: 'germany', title: 'Germany', date: '10/2019' },
        { name: 'charlotte', title: 'Charlotte', date: '6/2019' },
        { name: 'cabo2', title: 'Cabo', date: '1/2019' },
        { name: 'graduation', title: 'Graduation', date: '5/2018' },
        { name: 'columbus', title: 'Columbus', date: '3/2018' },
        { name: 'cabo1', title: 'Cabo', date: '5/2017' },
        { name: 'gatlinburg', title: 'Gatlinburg', date: '8/2016' }
    ];

    public subjectRouteChange = new Subject<NavigationEnd>();
    public get isMobile() { return window.innerWidth < 992; }

    constructor(
        private menuController: MenuController,
        private router: Router,
        private title: Title,
        private toastController: ToastController) {
        this.watchRoute();
    }

    public setTitle(pageTitle: string) {
        this.title.setTitle(`${this.appTitle} | ${pageTitle}`);
    }

    public titleCase(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public getGalleryUrl(path: string): string {
        return `/gallery/${path}`;
    }

    public async presentToast(color: string, message: string) {
        const toastOptions: ToastOptions = {
            color,
            message,
            position: 'top',
            duration: 6000,
            cssClass: 'toast-styles'
        };

        (await this.toastController.create(toastOptions)).present();
    }

    private watchRoute() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.menuController.close();
                this.subjectRouteChange.next(event);
            });
    }
}
