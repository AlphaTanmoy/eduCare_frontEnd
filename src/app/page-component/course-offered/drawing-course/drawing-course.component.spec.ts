import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingCourseComponent } from './drawing-course.component';

describe('DrawingCourseComponent', () => {
  let component: DrawingCourseComponent;
  let fixture: ComponentFixture<DrawingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
