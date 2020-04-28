import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailResetModalComponent } from './email-reset-modal.component';

describe('EmailResetModalComponent', () => {
    let component: EmailResetModalComponent;
    let fixture: ComponentFixture<EmailResetModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EmailResetModalComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(EmailResetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
