import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassoutStudentComponent } from './passout-student.component';

describe('PassoutStudentComponent', () => {
  let component: PassoutStudentComponent;
  let fixture: ComponentFixture<PassoutStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassoutStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassoutStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
