import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-popover-gallery-links',
    templateUrl: './popover-gallery-links.component.html',
    styleUrls: ['./popover-gallery-links.component.scss'],
})
export class PopoverGalleryLinksComponent {
    constructor(
        public popoverController: PopoverController,
        public utilsService: UtilsService
    ) { }
}
