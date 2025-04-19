import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrimaryCourseCategoryComponent } from './add-primary-course-category.component';

describe('AddPrimaryCourseCategoryComponent', () => {
  let component: AddPrimaryCourseCategoryComponent;
  let fixture: ComponentFixture<AddPrimaryCourseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrimaryCourseCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrimaryCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
