import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
	selector: 'app-deadline-popover',
	templateUrl: './deadline-popover.component.html',
	styleUrls: ['./deadline-popover.component.scss'],
})
export class DeadlinePopoverComponent {
	@Input()
	public deadlineMessage: string;

	constructor(
		public popoverController: PopoverController
	) { }
}
