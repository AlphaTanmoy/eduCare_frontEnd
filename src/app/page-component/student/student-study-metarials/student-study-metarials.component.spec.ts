import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStudyMetarialsComponent } from './student-study-metarials.component';

describe('StudentStudyMetarialsComponent', () => {
  let component: StudentStudyMetarialsComponent;
  let fixture: ComponentFixture<StudentStudyMetarialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStudyMetarialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStudyMetarialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
