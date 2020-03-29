import { Component } from '@angular/core';

import { UtilsService } from 'src/app/services/utils/utils.service';
import { User } from 'src/app/interfaces/user';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    public get user() { return this.utilsService.user; }
    public get fullName() { return `${this.user.firstName} ${this.user.lastName}`; }

    constructor(
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle(this.fullName);
    }
}
