import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeRegistrationComponent } from './notice-registration.component';

describe('NoticeRegistrationComponent', () => {
  let component: NoticeRegistrationComponent;
  let fixture: ComponentFixture<NoticeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
