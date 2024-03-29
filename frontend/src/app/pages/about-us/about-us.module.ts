import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MglTimelineModule } from 'angular-mgl-timeline';

import { AboutUsPage } from './about-us.page';

const routes: Routes = [
    {
        path: '',
        component: AboutUsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MglTimelineModule
    ],
    declarations: [AboutUsPage]
})
export class AboutUsPageModule { }
