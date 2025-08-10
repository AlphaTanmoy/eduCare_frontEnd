import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveStudentReEnrollmentComponent } from './inactive-student-re-enrollment.component';

describe('InactiveStudentReEnrollmentComponent', () => {
  let component: InactiveStudentReEnrollmentComponent;
  let fixture: ComponentFixture<InactiveStudentReEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveStudentReEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveStudentReEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
