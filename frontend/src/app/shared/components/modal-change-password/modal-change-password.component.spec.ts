import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChangePasswordComponent } from './modal-change-password.component';

describe('ModalChangePasswordComponent', () => {
    let component: ModalChangePasswordComponent;
    let fixture: ComponentFixture<ModalChangePasswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalChangePasswordComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
