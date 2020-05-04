import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverProfileLinksComponent } from './popover-profile-links.component';

describe('PopoverProfileLinksComponent', () => {
    let component: PopoverProfileLinksComponent;
    let fixture: ComponentFixture<PopoverProfileLinksComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PopoverProfileLinksComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PopoverProfileLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
