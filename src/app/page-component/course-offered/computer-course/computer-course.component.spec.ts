import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerCourseComponent } from './computer-course.component';

describe('ComputerCourseComponent', () => {
  let component: ComputerCourseComponent;
  let fixture: ComponentFixture<ComputerCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputerCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputerCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
