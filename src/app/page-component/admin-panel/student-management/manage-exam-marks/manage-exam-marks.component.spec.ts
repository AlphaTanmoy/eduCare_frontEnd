import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExamMarksComponent } from './manage-exam-marks.component';

describe('ManageExamMarksComponent', () => {
  let component: ManageExamMarksComponent;
  let fixture: ComponentFixture<ManageExamMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExamMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageExamMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
