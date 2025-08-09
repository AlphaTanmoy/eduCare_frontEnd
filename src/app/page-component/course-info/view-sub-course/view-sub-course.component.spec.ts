import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubCourseComponent } from './view-sub-course.component';

describe('ViewSubCourseComponent', () => {
  let component: ViewSubCourseComponent;
  let fixture: ComponentFixture<ViewSubCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSubCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSubCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
