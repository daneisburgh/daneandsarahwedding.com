import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryPageRoutingModule } from './gallery-routing.module';
import { Angular2ImageGalleryModule } from './angular2-image-gallery/angular2-image-gallery.module';

import { GalleryPage } from './gallery.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GalleryPageRoutingModule,
        Angular2ImageGalleryModule
    ],
    declarations: [GalleryPage]
})
export class GalleryPageModule { }
