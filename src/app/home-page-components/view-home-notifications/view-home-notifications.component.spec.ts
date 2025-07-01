import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHomeNotificationsComponent } from './view-home-notifications.component';

describe('ViewHomeNotificationsComponent', () => {
  let component: ViewHomeNotificationsComponent;
  let fixture: ComponentFixture<ViewHomeNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHomeNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHomeNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
