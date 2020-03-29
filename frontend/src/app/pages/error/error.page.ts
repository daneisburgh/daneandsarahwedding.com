import { Component } from '@angular/core';

import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
})
export class ErrorPage {
    constructor(
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('404');
    }
}
