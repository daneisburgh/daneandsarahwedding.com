import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { Platform, PopoverController, ModalController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { UserService } from './services/user/user.service';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    let modalControllerSpy: any;
    let popoverControllerSpy: any;
    let statusBarSpy: any;
    let splashScreenSpy: any;
    let platformReadySpy: any;
    let userServiceLogInSpy: any;

    let userService: UserService;
    let userServiceSpy: any;

    beforeEach(async(() => {
        modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
        popoverControllerSpy = jasmine.createSpyObj('PopoverController', ['create']);
        statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
        splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);

        const platformSpy = jasmine.createSpyObj('Platform', ['ready']);
        platformReadySpy = platformSpy.ready.and.returnValue(Promise.resolve());

        // const userServiceSpy = jasmine.createSpyObj('UserService', ['logIn']);
        // userServiceLogInSpy = userServiceSpy.logIn.and.returnValue(Promise.reject());

        const userService = TestBed.inject(UserService);
        userServiceSpy = spyOnAllFunctions(userService);

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: ModalController, useValue: modalControllerSpy },
                { provide: PopoverController, useValue: popoverControllerSpy },
                { provide: StatusBar, useValue: statusBarSpy },
                { provide: SplashScreen, useValue: splashScreenSpy },
                { provide: Platform, useValue: platformSpy },
                UserService
            ],
            imports: [
                HttpClientModule,
                IonicStorageModule.forRoot(),
                RouterTestingModule.withRoutes([])
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create and initialize the app', async () => {
        expect(component).toBeTruthy();
        expect(userServiceSpy.logIn).toHaveBeenCalled();
        expect(platformReadySpy).toHaveBeenCalled();
        expect(statusBarSpy.styleDefault).toHaveBeenCalled();
        expect(splashScreenSpy.hide).toHaveBeenCalled();
    });

    // it('should initialize the app', async(inject([UserService], (userService: UserService) => {
    //     console.log('userService:', userService);
    //     // expect(userServiceLogInSpy).toHaveBeenCalled();
    //     expect(platformReadySpy).toHaveBeenCalled();
    //     expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    //     expect(splashScreenSpy.hide).toHaveBeenCalled();
    // })));



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
