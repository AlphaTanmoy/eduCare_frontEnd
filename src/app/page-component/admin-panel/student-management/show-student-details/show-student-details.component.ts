import { ChangeDetectorRef, Component, EventEmitter, inject, Inject, Input, Optional, Output } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, Dropdown, EnrollmentStatus, EnrollmentStatusDescriptions, ResponseTypeColor, YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';
import { StudentService } from '../../../../service/student/student.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { Router } from '@angular/router';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';


@Component({
  selector: 'app-show-student-details',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule, CustomSingleSelectSearchableDropdownComponent],
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.css'
})
export class ShowStudentDetailsComponent {
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;


  @Input() student!: any;
  @Input() available_sub_course_categories: Dropdown[] = [];
  @Output() api_call_going = new EventEmitter<boolean>();

  student_image: string | null = null;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ActiveInactiveStatus = ActiveInactiveStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  EnrollmentStatus = EnrollmentStatus;
  EnrollmentStatusDescriptions = EnrollmentStatusDescriptions;


  student_info: any = {};
  enrolled_courses: string[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.student_info = this.student;
    this.student_image = this.student.student_photo;
  }

  ReEnroll() {
    this.activeMatProgressBar();
    this.api_call_going.emit(true);

    const obj = {
      passout_student_id: this.student_info.student_id,
      enrolled_courses: this.enrolled_courses
    }

    this.studentService.StudentReEnrollment(obj).subscribe({
      next: (response) => {
        this.hideMatProgressBar();
        this.api_call_going.emit(false);

        if (response.status === 200) {
          this.student_info = response.data[0];
          this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
        } else {
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.api_call_going.emit(false);
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
  }

  GetIsEmailVerifiedLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  GetEnrollmentStatusLabel(value: string): string {
    return EnrollmentStatusDescriptions[value as EnrollmentStatus] || 'Unknown';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'defaults/avatar-default.svg'; // path to your default image
  }

  handleSelectedSubCourses(item: Dropdown | any) {
    this.enrolled_courses = [];
    this.enrolled_courses.push(item.id ?? "");
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (navigateRoute) {
        this.router.navigate([navigateRoute]);
      }
    });
  }
}
