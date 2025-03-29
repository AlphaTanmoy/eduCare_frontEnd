import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSlideshowUpdateComponent } from './home-slideshow-update.component';

describe('HomeSlideshowUpdateComponent', () => {
  let component: HomeSlideshowUpdateComponent;
  let fixture: ComponentFixture<HomeSlideshowUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSlideshowUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSlideshowUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
