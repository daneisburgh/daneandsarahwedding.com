import { Component } from '@angular/core';

import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public days: number;
    public hours: number;
    public minutes: number;
    public seconds: number;

    private secondsToMarriage: number;

    public get isMobile() { return this.utilsService.isMobile; }

    constructor(
        private utilsService: UtilsService
    ) {
        const todayEst = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const weddingEst = new Date('10/24/2020 18:30:00 EST');
        this.secondsToMarriage = (weddingEst.getTime() - todayEst.getTime()) / 1000;
        this.updateCountdown();

        setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    public ionViewDidEnter() {
        this.utilsService.setTitle('Home');
    }

    private updateCountdown() {
        this.secondsToMarriage -= 1;
        let seconds = this.secondsToMarriage;
        this.days = Math.floor(seconds / 86400);
        seconds -= this.days * 86400;
        this.hours = Math.floor(seconds / 3600);
        seconds -= this.hours * 3600;
        this.minutes = Math.floor(seconds / 60);
        seconds -= this.minutes * 60;
        this.seconds = seconds;
    }
}
