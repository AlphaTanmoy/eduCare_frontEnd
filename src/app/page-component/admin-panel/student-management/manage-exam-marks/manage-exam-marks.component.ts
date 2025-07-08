import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap } from '../../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { EnrollmentStatus, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
import { StudentService } from '../../../../service/student/student.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AuthService } from '../../../../service/auth/Auth.Service';

@Component({
  selector: 'app-manage-exam-marks',
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatProgressBarModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './manage-exam-marks.component.html',
  styleUrl: './manage-exam-marks.component.css'
})
export class ManageExamMarksComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  StudentId: string | null = null;

  MaximumPracticalMarks: number = 0;
  MaximumTheoreticalMarks: number = 0;
  ModuleCount: number = 0;
  ModuleDetails: any[] = [];
  OriginalMarks: any[] = [];
  course_code: string | null = null;
  student_enrollment_status: string | null = null;

  err_msg: string | null = null;

  role: string | null = null;
  UserRole = UserRole;
  EnrollmentStatus = EnrollmentStatus;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.params.subscribe(params => {
      this.StudentId = params['studentId'];
      if (!this.StudentId) {
        this.openDialog("Marks Update", "Student Id is required", ResponseTypeColor.ERROR, 'control-panel/manage-student/active-student');
        return;
      }
    });
    this.FetchStudentCourseDetails();

    this.role = this.authService.getUserRole();

    if (this.role === UserRole.ADMIN || this.role === UserRole.MASTER) {
      this.openDialog("Marks Update", "You are viewing this page as a Master/Admin. Some features might be disabled for you.", ResponseTypeColor.INFO, null);
    }
  }

  FetchStudentCourseDetails() {
    this.activeMatProgressBar();

    this.studentService.getStudentCourseInfo(this.StudentId).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.MaximumPracticalMarks = response.data[0].maximum_practical_marks;
          this.MaximumTheoreticalMarks = response.data[0].maximum_theory_marks;
          this.ModuleCount = response.data[0].module_count;
          this.ModuleDetails = response.data[0].module_details;
          this.OriginalMarks = response.data[0].original_marks;
          this.course_code = response.data[0].course_code;
          this.student_enrollment_status = response.data[0].student_enrollment_status;
        } else {
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  ValidateTheoryMarks(data: any) {
    if (data.theory_marks < 0) {
      data.theory_err_msg = "Theory marks cannot be negative";
    } else if (data.theory_marks > this.MaximumTheoreticalMarks) {
      data.theory_err_msg = "Theory marks cannot be more than the maximum theoretical marks : " + this.MaximumTheoreticalMarks;
    } else {
      data.theory_err_msg = null;
    }
  }

  ValidatePracticalMarks(data: any) {
    if (data.practical_marks < 0) {
      data.practical_err_msg = "Practical marks cannot be negative";
    } else if (data.practical_marks > this.MaximumPracticalMarks) {
      data.practical_err_msg = "Practical marks cannot be more than the maximum practical marks : " + this.MaximumPracticalMarks;
    } else {
      data.practical_err_msg = null;
    }
  }

  SaveMarks(data: any) {
    this.activeMatProgressBar();

    this.studentService.updateStudentMarks(this.StudentId, this.course_code, data).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.FetchStudentCourseDetails();
          this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
        } else {
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
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
