import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-edit-primary-course-category',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './edit-primary-course-category.component.html',
  styleUrl: './edit-primary-course-category.component.css'
})
export class EditPrimaryCourseCategoryComponent {
  oldCourseName: string = '';
  courseName: string = '';
  sameCourseNameEntered: boolean = true;
  error: string | null = null;
  currentCourses: any;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    public dialogRef: MatDialogRef<EditPrimaryCourseCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course_id: string; currentCourses: any }
  ) { }

  onCourseNameInput() {
    this.courseName = this.courseName.trim();
    this.sameCourseNameEntered = false;

    if (this.currentCourses.includes(this.courseName)) {
      this.error = "A Course with this name already exists";
    } else if (this.courseName === this.oldCourseName) {
      this.sameCourseNameEntered = true;
    } else {
      this.error = null;
    }
  }

  onSubmit() {
    this.dialogRef.close(this.courseName);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.currentCourses = this.data.currentCourses
                        .filter((course: any) => course.courseName)
                        .map((course: any) => course.courseName);

    this.oldCourseName = this.data.currentCourses.filter((course: any) => course.id === this.data.course_id)[0].courseName;
    this.currentCourses = this.currentCourses.filter((course: string) => course !== this.oldCourseName);
    this.courseName = this.oldCourseName;

    console.log(this.oldCourseName, this.courseName, this.currentCourses)
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
