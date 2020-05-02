import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeEmailModalComponent } from './change-email-modal.component';

describe('ChangeEmailModalComponent', () => {
    let component: ChangeEmailModalComponent;
    let fixture: ComponentFixture<ChangeEmailModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangeEmailModalComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangeEmailModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
