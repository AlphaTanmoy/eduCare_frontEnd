import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHomeNotificationComponent } from './view-home-notification.component';

describe('ViewHomeNotificationComponent', () => {
  let component: ViewHomeNotificationComponent;
  let fixture: ComponentFixture<ViewHomeNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHomeNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHomeNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
