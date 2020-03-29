import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageService } from './services/image.service'
import { GalleryComponent } from './gallery/gallery.component';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        IonicModule
    ],
    declarations: [
        GalleryComponent,
        ViewerComponent
    ],
    providers: [
        ImageService
    ],
    exports: [
        GalleryComponent,
        ViewerComponent
    ]
})
export class Angular2ImageGalleryModule {
}
