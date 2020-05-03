import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChangeEmailComponent } from './modal-change-email.component';

describe('ModalChangeEmailComponent', () => {
    let component: ModalChangeEmailComponent;
    let fixture: ComponentFixture<ModalChangeEmailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalChangeEmailComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalChangeEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
