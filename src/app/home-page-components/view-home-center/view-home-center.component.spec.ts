import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHomeCenterComponent } from './view-home-center.component';

describe('ViewHomeCenterComponent', () => {
  let component: ViewHomeCenterComponent;
  let fixture: ComponentFixture<ViewHomeCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHomeCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHomeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
