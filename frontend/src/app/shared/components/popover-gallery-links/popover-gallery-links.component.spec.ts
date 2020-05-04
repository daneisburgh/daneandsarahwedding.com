import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverGalleryLinksComponent } from './popover-gallery-links.component';

describe('PopoverGalleryLinksComponent', () => {
    let component: PopoverGalleryLinksComponent;
    let fixture: ComponentFixture<PopoverGalleryLinksComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PopoverGalleryLinksComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PopoverGalleryLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
