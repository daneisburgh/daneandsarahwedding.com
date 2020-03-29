import { Component } from '@angular/core';

import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
})
export class UsersPage {
    constructor(
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('Users');
    }
}
