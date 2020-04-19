import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { UserService } from '../../services/user/user.service';

@Component({
	selector: 'app-profile-popover',
	templateUrl: './profile-popover.component.html',
	styleUrls: ['./profile-popover.component.scss'],
})
export class ProfilePopoverComponent {
	constructor(
		public popoverController: PopoverController,
		private userService: UserService
	) { }

	public logOut() {
		this.userService.logOut();
		this.popoverController.dismiss();
	}
}
