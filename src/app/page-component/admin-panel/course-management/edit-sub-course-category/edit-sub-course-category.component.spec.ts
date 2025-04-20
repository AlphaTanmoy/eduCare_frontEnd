import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubCourseCategoryComponent } from './edit-sub-course-category.component';

describe('EditSubCourseCategoryComponent', () => {
  let component: EditSubCourseCategoryComponent;
  let fixture: ComponentFixture<EditSubCourseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubCourseCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSubCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
