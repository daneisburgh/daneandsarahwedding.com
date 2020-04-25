import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { Platform, PopoverController, ModalController, IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { UserService } from './services/user/user.service';

describe('AppComponent', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                HttpClientModule,
                IonicModule.forRoot(),
                IonicStorageModule.forRoot(),
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                ModalController,
                PopoverController,
                StatusBar,
                SplashScreen,
                Platform,
                UserService
            ]
        }).compileComponents();
    });

    it('should authenticate and initialize', async () => {
        const userService = TestBed.inject(UserService);
        const platform = TestBed.inject(Platform);
        const statusBar = TestBed.inject(StatusBar);
        const splashScreen = TestBed.inject(SplashScreen);

        const userServiceLogInSpy = spyOn(userService, 'logIn').and.callThrough();
        const platformReadySpy = spyOn(platform, 'ready').and.callThrough();
        const statusBarStyleDefaultSpy = spyOn(statusBar, 'styleDefault');
        const splashScreenHideSpy = spyOn(splashScreen, 'hide');

        const fixture = TestBed.createComponent(AppComponent);
        const component: AppComponent = fixture.debugElement.componentInstance;

        expect(component).toBeTruthy();
        expect(component.isReady).toBe(false);

        expect(userServiceLogInSpy).toHaveBeenCalled();
        await expectAsync(userService.logIn()).toBeRejected();

        expect(platformReadySpy).toHaveBeenCalled();
        await expectAsync(platform.ready()).toBeResolved();

        expect(statusBarStyleDefaultSpy).toHaveBeenCalled();
        expect(splashScreenHideSpy).toHaveBeenCalled();
        expect(component.isReady).toBe(true);
    });

    it ('should present popovers', async () => {
        // const popoverController = TestBed.inject(PopoverController);
        // const popoverControllerCreateSpy = spyOn(popoverController, 'create');

        const fixture = TestBed.createComponent(AppComponent);
        const component: AppComponent = fixture.debugElement.componentInstance;

        expect(component).toBeTruthy();
        await expectAsync(component.presentGalleryPopover(undefined)).toBeResolved();
        await expectAsync(component.presentLogInModal()).toBeResolved();
        // await expectAsync(component)

        // const presentGalleryPopover = component.presentGalleryPopover(undefined);
        // expect(popoverControllerCreateSpy).toHaveBeenCalled();
        // await presentGalleryPopover;

        // const presentLogInModal = component.presentLogInModal();
        // expect(popoverControllerCreateSpy).toHaveBeenCalled();
        // await presentLogInModal;

        // component.presentProfilePopover(undefined);
        // await expectAsync(popoverControllerCreateSpy).toBeResolved();
    });

    // it('should have menu labels', async () => {
    //     const fixture = await TestBed.createComponent(AppComponent);
    //     await fixture.detectChanges();
    //     const app = fixture.nativeElement;
    //     const menuItems = app.querySelectorAll('ion-label');
    //     expect(menuItems.length).toEqual(2);
    //     expect(menuItems[0].textContent).toContain('Home');
    //     expect(menuItems[1].textContent).toContain('List');
    // });

    // it('should have urls', async () => {
    //     const fixture = await TestBed.createComponent(AppComponent);
    //     await fixture.detectChanges();
    //     const app = fixture.nativeElement;
    //     const menuItems = app.querySelectorAll('ion-item');
    //     expect(menuItems.length).toEqual(2);
    //     expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/');
    //     expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
    // });
});
