import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap } from '../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../constants/commonConstants';
import { StudentService } from '../../../service/student/student.service';

@Component({
  selector: 'app-manage-exam-marks',
  imports: [],
  templateUrl: './manage-exam-marks.component.html',
  styleUrl: './manage-exam-marks.component.css'
})
export class ManageExamMarksComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  StudentId: string | null = null;

  StudentEnrolledCourses: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.params.subscribe(params => {
      this.StudentId = params['studentId'];
      if (!this.StudentId) {
        this.openDialog("Marks Update", "Student Id is required", ResponseTypeColor.ERROR, 'control-panel/manage-student');
        return;
      }
    });
    this.FetchStudentCourseDetails();
  }

  FetchStudentCourseDetails() {
    this.studentService.getStudentCourseInfo(this.StudentId).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.StudentEnrolledCourses = response.data[0];
          console.log(this.StudentEnrolledCourses)
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
