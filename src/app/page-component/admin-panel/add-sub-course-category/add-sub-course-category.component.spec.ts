import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubCourseCategoryComponent } from './add-sub-course-category.component';

describe('AddSubCourseCategoryComponent', () => {
  let component: AddSubCourseCategoryComponent;
  let fixture: ComponentFixture<AddSubCourseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubCourseCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
