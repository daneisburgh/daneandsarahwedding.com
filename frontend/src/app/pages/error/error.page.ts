import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import builtinStatusCodes from 'builtin-status-codes';
import { get } from 'lodash';

import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
})
export class ErrorPage {
    public statusCode: number;
    public get statusText() { return get(builtinStatusCodes, this.statusCode); }
    public get statusMessage() { return this.statusCode ? `Error: ${this.statusText}` : ''; }

    constructor(
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('Error');
        const params = this.activatedRoute.snapshot.params;
        this.statusCode = params.statusCode && get(builtinStatusCodes, params.statusCode) ? params.statusCode : 404;
    }
}
