import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHomeBrandComponent } from './view-home-brand.component';

describe('ViewHomeBrandComponent', () => {
  let component: ViewHomeBrandComponent;
  let fixture: ComponentFixture<ViewHomeBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHomeBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHomeBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
