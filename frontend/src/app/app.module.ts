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

import { ModalLogInComponent } from './shared/components/modal-log-in/modal-log-in.component';
import { ModalChangeEmailComponent } from './shared/components/modal-change-email/modal-change-email.component';
import { PopoverGalleryLinksComponent } from './shared/components/popover-gallery-links/popover-gallery-links.component';
import { PopoverProfileLinksComponent } from './shared/components/popover-profile-links/popover-profile-links.component';
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
            preventDuplicates: false
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
        ModalChangeEmailComponent,
        ModalLogInComponent,
        PopoverGalleryLinksComponent,
        PopoverProfileLinksComponent
    ],
    entryComponents: [
        ModalChangeEmailComponent,
        ModalLogInComponent,
        PopoverGalleryLinksComponent,
        PopoverProfileLinksComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
