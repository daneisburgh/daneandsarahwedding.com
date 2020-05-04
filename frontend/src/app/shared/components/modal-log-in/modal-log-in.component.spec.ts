import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalLogInComponent } from './modal-log-in.component';

describe('ModalLogInComponent', () => {
    let component: ModalLogInComponent;
    let fixture: ComponentFixture<ModalLogInComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalLogInComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalLogInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
