import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOfferedComponent } from './course-offered.component';

describe('CourseOfferedComponent', () => {
  let component: CourseOfferedComponent;
  let fixture: ComponentFixture<CourseOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseOfferedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
