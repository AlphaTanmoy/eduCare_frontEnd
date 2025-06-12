import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateRangePickerComponent } from './custom-date-range-picker.component';

describe('CustomDateRangePickerComponent', () => {
  let component: CustomDateRangePickerComponent;
  let fixture: ComponentFixture<CustomDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
