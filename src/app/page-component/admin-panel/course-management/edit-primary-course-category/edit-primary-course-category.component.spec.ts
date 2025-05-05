import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrimaryCourseCategoryComponent } from './edit-primary-course-category.component';

describe('EditPrimaryCourseCategoryComponent', () => {
  let component: EditPrimaryCourseCategoryComponent;
  let fixture: ComponentFixture<EditPrimaryCourseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPrimaryCourseCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrimaryCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
