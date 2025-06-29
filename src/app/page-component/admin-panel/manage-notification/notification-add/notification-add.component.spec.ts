import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAddComponent } from './notification-add.component';

describe('NotificationAddComponent', () => {
  let component: NotificationAddComponent;
  let fixture: ComponentFixture<NotificationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
