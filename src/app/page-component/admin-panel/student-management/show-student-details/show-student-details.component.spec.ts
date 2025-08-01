import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudentDetailsComponent } from './show-student-details.component';

describe('ShowStudentDetailsComponent', () => {
  let component: ShowStudentDetailsComponent;
  let fixture: ComponentFixture<ShowStudentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowStudentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
