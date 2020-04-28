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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GalleryPopoverComponent } from './components/gallery-popover/gallery-popover.component';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
import { ChangeEmailModalComponent } from './components/change-email-modal/change-email-modal.component';
import { LogInModalComponent } from './components/log-in-modal/log-in-modal.component';

import { UserService } from './services/user/user.service';
import { UtilsService } from './services/utils/utils.service';

import { AdminGuard } from './guards/admin/admin.guard';
import { UserGuard } from './guards/user/user.guard';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        UserService,
        UtilsService,
        AdminGuard,
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
