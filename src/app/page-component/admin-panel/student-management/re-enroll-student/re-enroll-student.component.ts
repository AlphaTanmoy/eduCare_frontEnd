import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CertificateTicketStatus, CertificateTicketStatusDescriptions, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
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
import { StudentCertificateService } from '../../../../service/student-certificate/student-certificate.service';
import { convertBlobToBase64, GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { ViewStudentComponent } from '../view-student/view-student.component';
import { ShowStudentDetailsComponent } from '../show-student-details/show-student-details.component';


@Component({
  selector: 'app-re-enroll-student',
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatProgressBarModule,
    FormsModule,
    MatTableModule,
    ShowStudentDetailsComponent
  ],
  templateUrl: './re-enroll-student.component.html',
  styleUrl: './re-enroll-student.component.css'
})
export class ReEnrollStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  student_id: string | null = null;

  IsSearchAndReEnrollmentEnabled: boolean = false;

  student_info: any | null = null;
  student_photo: string | null = null;
  done_fetching: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.route.paramMap.subscribe(params => {
      const id = params.get('student_id');
      if (id) {
        this.student_id = id;
        console.log('Student ID:', this.student_id);
        this.GetStudentDetails();
      } else {
        this.IsSearchAndReEnrollmentEnabled = true;
        console.log('Search and Re-Enrollment Enabled');
        this.GetStudentDetails();
      }
    });
  }

  GetStudentDetails(): void {
    this.activeMatProgressBar();

    this.studentService.GetStudentInfoByRegistrationNumber("ECI25-00003").subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.student_info = response.data[0];

          this.studentService.getStudentPhotoStream(this.student_info.student_guid).subscribe({
            next: async(imageData: Blob) => {
              const base64Image = await convertBlobToBase64(imageData);
              this.student_info.student_photo = `data:image/jpg;base64,${base64Image}`;
              this.hideMatProgressBar();
              this.done_fetching = true;
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
            }
          });

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
