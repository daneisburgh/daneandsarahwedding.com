import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { deadlineString } from '../profile/profile.page';
import { LogInModalComponent } from '../../components/log-in-modal/log-in-modal.component';
import { UserService } from '../../services/user/user.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.page.html',
    styleUrls: ['./info.page.scss'],
})
export class InfoPage {
    public deadlineString = deadlineString;

    public get user() { return this.userService.user; }

    constructor(
        public modalController: ModalController,
        private userService: UserService,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('Info');
    }

    public async presentLogInModal() {
        (await this.modalController.create({
            component: LogInModalComponent,
            cssClass: 'app-log-in-modal'
        })).present();
    }
}
