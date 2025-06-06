import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-add-primary-course-category',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './add-primary-course-category.component.html',
  styleUrl: './add-primary-course-category.component.css'
})

export class AddPrimaryCourseCategoryComponent {
  courseName: string = '';
  error: string | null = null;
  currentCourses: any;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    public dialogRef: MatDialogRef<AddPrimaryCourseCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentCourses: any }
  ) { }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.courseName = input.value;
    this.courseName = this.courseName.trim();

    if (this.currentCourses.includes(this.courseName.toLowerCase())) {
      this.error = "A Course with this name already exists";
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
      .map((course: any) => course.courseName.toLowerCase());
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
