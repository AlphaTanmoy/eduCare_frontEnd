import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-primary-course-category',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './add-primary-course-category.component.html',
  styleUrl: './add-primary-course-category.component.css'
})

export class AddPrimaryCourseCategoryComponent {
  courseName: string = '';
  loading: boolean = false;
  error: string | null = null;

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    public dialogRef: MatDialogRef<AddPrimaryCourseCategoryComponent>,
  ) { }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.courseName = input.value;
    this.courseName = this.courseName.trim();
  }

  onSubmit() {
    this.dialogRef.close(this.courseName);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
