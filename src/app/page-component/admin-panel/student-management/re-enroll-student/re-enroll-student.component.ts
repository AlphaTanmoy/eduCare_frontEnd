import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CertificateTicketStatus, CertificateTicketStatusDescriptions, Dropdown, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
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
import { FranchiseService } from '../../../../service/franchise/franchise.service';


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
  matProgressBarVisible1 = false;

  student_id: string | null = null;

  IsSearchAndReEnrollmentEnabled: boolean = false;
  student_req_number: string | null = null;

  student_info: any | null = null;
  student_photo: string | null = null;
  available_sub_course_categories: Dropdown[] = [];
  done_fetching: boolean = false;
  done_fetching_all: boolean = false;

  child_component_api_call_going_status: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private franchiseService: FranchiseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.route.paramMap.subscribe(params => {
      const id = params.get('student_id');

      if (id) {
        this.student_id = id;
        this.GetStudentDetailsByRegStudentObjectId();
      } else {
        this.IsSearchAndReEnrollmentEnabled = true;
      }
    });
  }

  GetAssociatedCoursesOfFranchise(franchise_object_id: string) {
    this.activeMatProgressBar1();

    this.franchiseService.getAllAvailableSubCourseByFranchise(franchise_object_id).subscribe({
      next: (response) => {
        this.hideMatProgressBar1();

        if (response.status === 200) {
          const data = response.data;
          data.forEach((element: any) => {
            this.available_sub_course_categories.push(new Dropdown(element.course_code, element.course_name));
          });

          this.done_fetching_all = true;
        } else {
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar1();
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  GetStudentDetailsByRegStudentObjectId(): void {
    this.activeMatProgressBar();

    this.studentService.GetStudentInfoByStudentObjectId(this.student_id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.student_info = response.data[0];
          this.done_fetching = true;

          this.GetAssociatedCoursesOfFranchise(this.student_info.associated_franchise_id);

          this.studentService.getStudentPhotoStream(this.student_info.student_guid).subscribe({
            next: async (imageData: Blob) => {
              const base64Image = await convertBlobToBase64(imageData);
              this.student_info.student_photo = `data:image/jpg;base64,${base64Image}`;
              this.hideMatProgressBar();
              this.done_fetching = false;
              setTimeout(() => { this.done_fetching = true; }, 1);


              if (this.student_info.student_already_reenrolled_in_an_active_course === true) {
                this.openDialog("Student", `Student already enrolled in an active course.<br>You can't re-enroll this student.`, ResponseTypeColor.INFO, null);
              }
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
            }
          });

        } else {
          this.hideMatProgressBar();
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  GetStudentDetailsByRegNumber(): void {
    this.activeMatProgressBar();

    this.studentService.GetStudentInfoByRegistrationNumber(this.student_req_number).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.student_info = response.data[0];
          this.done_fetching = true;

          this.GetAssociatedCoursesOfFranchise(this.student_info.associated_franchise_id);

          this.studentService.getStudentPhotoStream(this.student_info.student_guid).subscribe({
            next: async (imageData: Blob) => {
              const base64Image = await convertBlobToBase64(imageData);
              this.student_info.student_photo = `data:image/jpg;base64,${base64Image}`;
              this.hideMatProgressBar();
              this.done_fetching = false;
              setTimeout(() => { this.done_fetching = true; }, 1);


              if (this.student_info.student_already_reenrolled_in_an_active_course === true) {
                this.openDialog("Student", `Student already enrolled in an active course.<br>You can't re-enroll this student.`, ResponseTypeColor.INFO, null);
              }
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

  ApiCallGoingResponseFromChildComponent(status: boolean) {
    this.child_component_api_call_going_status = status;
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

  activeMatProgressBar1() {
    this.matProgressBarVisible1 = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar1() {
    this.matProgressBarVisible1 = false;
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
