import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-gallery-popover',
    templateUrl: './gallery-popover.component.html',
    styleUrls: ['./gallery-popover.component.scss'],
})
export class GalleryPopoverComponent {
    constructor(
        public popoverController: PopoverController,
        public utilsService: UtilsService
    ) { }
}
