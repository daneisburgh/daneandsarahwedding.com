import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { GalleryPopoverComponent } from '../../components/gallery-popover/gallery-popover.component';
import { UtilsService } from '../../services/utils/utils.service';
import { GalleryData } from '../../interfaces/gallery-data';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
    public gallery: GalleryData;

    public get metadataUri(): string {
        return this.gallery ?
            `assets/images/gallery/${this.gallery.name}/data.json` : undefined;
    }

    constructor(
        public utilsService: UtilsService,
        private activatedRoute: ActivatedRoute,
        private popoverController: PopoverController
    ) { }

    public ionViewDidEnter() {
        this.activatedRoute.params.subscribe(params => {
            this.gallery = this.utilsService.galleryData.find(g => g.name === params.galleryName);
            this.utilsService.setTitle(`${this.gallery.title} Gallery`);
        });
    }

    public async presentGalleryPopover(event: any) {
        (await this.popoverController.create({ event, component: GalleryPopoverComponent })).present();
    }
}
