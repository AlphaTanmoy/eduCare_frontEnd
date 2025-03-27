import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeHolidayComponent } from './notice-holiday.component';

describe('NoticeHolidayComponent', () => {
  let component: NoticeHolidayComponent;
  let fixture: ComponentFixture<NoticeHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeHolidayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
