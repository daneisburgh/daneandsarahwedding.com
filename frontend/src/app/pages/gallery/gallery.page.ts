import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { PopoverGalleryLinksComponent } from '../../shared/components/popover-gallery-links/popover-gallery-links.component';
import { UtilsService } from '../../shared/services/utils/utils.service';

interface Gallery {
    name: string;
    title: string;
    date: string;
}

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
    public gallery: Gallery;

    public get metadataUri() {
        return this.gallery ? `assets/images/gallery/${this.gallery.name}/data.json` : undefined;
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
        (await this.popoverController.create({ event, component: PopoverGalleryLinksComponent })).present();
    }
}
