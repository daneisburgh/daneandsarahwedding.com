import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import builtinStatusCodes from 'builtin-status-codes';
import { get } from 'lodash';

import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
})
export class ErrorPage {
    public statusCode: number;
    public get statusText(): string { return get(builtinStatusCodes, this.statusCode); }
    public get statusMessage(): string { return this.statusCode ? `${this.statusCode}: ${this.statusText}` : ''; }

    constructor(
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        const params = this.activatedRoute.snapshot.params;
        this.statusCode = params.statusCode && get(builtinStatusCodes, params.statusCode) ? params.statusCode : 404;
        this.utilsService.setTitle(this.statusText);
    }
}
