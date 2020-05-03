import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GalleryPopoverComponent } from './shared/components/gallery-popover/gallery-popover.component';
import { ProfilePopoverComponent } from './shared/components/profile-popover/profile-popover.component';
import { ChangeEmailModalComponent } from './shared/components/change-email-modal/change-email-modal.component';
import { LogInModalComponent } from './shared/components/log-in-modal/log-in-modal.component';

import { UserService } from './shared/services/user/user.service';
import { UtilsService } from './shared/services/utils/utils.service';
import { UserGuard } from './shared/guards/user/user.guard';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        ToastrModule.forRoot({
            disableTimeOut: true,
            closeButton: true,
            tapToDismiss: false,
            preventDuplicates: true
        }),
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        UserService,
        UtilsService,
        UserGuard
    ],
    declarations: [
        AppComponent,
        GalleryPopoverComponent,
        ProfilePopoverComponent,
        ChangeEmailModalComponent,
        LogInModalComponent
    ],
    entryComponents: [
        GalleryPopoverComponent,
        ProfilePopoverComponent,
        ChangeEmailModalComponent,
        LogInModalComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
