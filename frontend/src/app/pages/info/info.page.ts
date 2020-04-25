import { Component } from '@angular/core';

import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.page.html',
    styleUrls: ['./info.page.scss'],
})
export class InfoPage {
    constructor(
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('Info');
    }
}
