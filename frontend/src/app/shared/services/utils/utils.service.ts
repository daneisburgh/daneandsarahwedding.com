import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
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
        private toastr: ToastrService) {
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

    public toast(status: 'success' | 'warning' | 'error', title: string, message?: string) {
        switch (status) {
            case 'success':
                this.toastr.success(message, title);
                break;
            case 'warning':
                this.toastr.warning(message, title);
                break;
            case 'error':
                this.toastr.error(message, title);
                break;
        }
    }

    public toastBadRequest() {
        this.toast('error', 'Bad request',
            'Please contact us if the error persists');
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
