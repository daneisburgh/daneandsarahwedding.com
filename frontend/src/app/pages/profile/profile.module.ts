import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { DeadlinePopoverComponent } from './deadline-popover/deadline-popover.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ProfilePageRoutingModule
	],
	entryComponents: [
		DeadlinePopoverComponent
	],
	declarations: [
		ProfilePage,
		DeadlinePopoverComponent
	]
})
export class ProfilePageModule { }
