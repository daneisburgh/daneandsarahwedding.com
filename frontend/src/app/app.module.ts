import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GalleryPopoverComponent } from './components/gallery-popover/gallery-popover.component';
import { LogInModalComponent } from './components/log-in-modal/log-in-modal.component';

import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { UtilsService } from './services/utils/utils.service';

import { UserGuard } from './guards/user/user.guard';
import { AdminGuard } from './guards/admin/admin.guard';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        IonicModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AuthService,
        DataService,
        UtilsService,
        UserGuard,
        AdminGuard
    ],
    declarations: [
        AppComponent,
        GalleryPopoverComponent,
        LogInModalComponent
    ],
    entryComponents: [
        GalleryPopoverComponent,
        LogInModalComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
