import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { ActiveInactiveStatus, Dropdown } from '../../../../constants/commonConstants';

@Component({
  selector: 'app-edit-primary-course-category',
  imports: [CommonModule, FormsModule, MatDialogModule, CustomSingleSelectSearchableDropdownComponent],
  templateUrl: './edit-primary-course-category.component.html',
  styleUrl: './edit-primary-course-category.component.css'
})
export class EditPrimaryCourseCategoryComponent {
  oldCourseName: string = '';
  courseName: string = '';
  oldDataStatus: string = '';
  dataStatus: string = '';
  dataStatusOptions: Dropdown[] = [];

  sameCourseNameEntered: boolean = true;
  sameDataStatusChecked: boolean = true;

  error: string | null = null;
  currentCourses: any;
  ActiveInactiveStatus = ActiveInactiveStatus;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    public dialogRef: MatDialogRef<EditPrimaryCourseCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course_id: string; data_status: string; currentCourses: any; data_status_options: Dropdown[] }
  ) { }

  onCourseNameInput() {
    this.validation();
  }

  onSubmit() {
    var obj = {
      courseName: this.courseName,
      dataStatus: this.dataStatus
    }
    this.dialogRef.close(obj);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();

    this.oldDataStatus = this.data.data_status;
    this.dataStatus = this.data.data_status;
    this.dataStatusOptions = this.data.data_status_options;

    this.currentCourses = this.data.currentCourses
      .filter((course: any) => course.courseName)
      .map((course: any) => course.courseName);

    this.oldCourseName = this.data.currentCourses.filter((course: any) => course.id === this.data.course_id)[0].courseName;
    this.currentCourses = this.currentCourses.filter((course: string) => course !== this.oldCourseName);
    this.courseName = this.oldCourseName;
  }

  onStatusChange(isChecked: boolean) {
    this.dataStatus = isChecked ? ActiveInactiveStatus.ACTIVE : ActiveInactiveStatus.INACTIVE;
    this.validation();
  }

  validation() {
    this.courseName = this.courseName.trim();
    this.sameCourseNameEntered = false;
    this.sameDataStatusChecked = false;

    if (this.currentCourses.includes(this.courseName)) {
      this.error = "A Course with this name already exists";
    } else {
      this.error = null;
    }

    if (this.courseName === this.oldCourseName) {
      this.sameCourseNameEntered = true;
    }
    if (this.oldDataStatus === this.dataStatus) {
      this.sameDataStatusChecked = true;
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
