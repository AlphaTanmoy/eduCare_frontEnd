import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { StudentService } from '../../../../service/student/student.service';
import { firstValueFrom } from 'rxjs';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, EnrollmentStatus, EnrollmentStatusDescriptions, IndexedDBItemKey, ResponseTypeColor, StudentDocumentName, UserRole, YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { faEdit, faCircleXmark, faTrash, faEye, faDownload, faMoneyCheckDollar, faArrowRotateLeft, faGraduationCap, faRectangleList, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { ViewStudentComponent } from '../view-student/view-student.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { WalletService } from '../../../../service/wallet/wallet.service';
import { CustomConfirmDialogWithRemarksComponent } from '../../../../common-component/custom-confirm-dialog-with-remarks/custom-confirm-dialog-with-remarks.component';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { Router } from '@angular/router';
import { StudentCertificateService } from '../../../../service/student-certificate/student-certificate.service';
import { IssueCertificateComponent } from '../issue-certificate/issue-certificate.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-student',
  imports: [CommonModule, MatTooltipModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule, MatProgressBarModule],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.css'
})
export class ManageStudentComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_index: number = 0;
  page_size: number = 10;

  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faCircleXmark = faCircleXmark;
  faDownload = faDownload;
  faMoneyCheckDollar = faMoneyCheckDollar;
  faArrowRotateLeft = faArrowRotateLeft;
  faGraduationCap = faGraduationCap;
  faRectangleList = faRectangleList;
  faFileDownload = faFileDownload;

  YesNoStatus = YesNoStatus;
  YesNoStatusDescriptions = YesNoStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  EnrollmentStatus = EnrollmentStatus;
  EnrollmentStatusDescriptions = EnrollmentStatusDescriptions;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;

  isFranchise: boolean = false;
  isAdmin: boolean = false;

  displayedColumns: string[] = ['regno', 'student_name', 'email', 'phone', 'franchise', 'student_enrollment_status', 'data_status', 'enrollment_status_update', 'action'];

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
    private walletService: WalletService,
    private studentCertificateService: StudentCertificateService,
  ) { }

  async ngOnInit() {
    let userRole = await this.authService.getUserRole();
    if (userRole === UserRole.FRANCHISE) {
      this.isFranchise = true;
    } else if(userRole === UserRole.ADMIN || userRole === UserRole.MASTER) {
      this.isAdmin = true;
    }

    this.bootstrapElements = loadBootstrap();
    await this.getStudents(this.page_index, this.page_size);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(async (event) => {
      this.page_index = event.pageIndex;
      this.page_size = event.pageSize;
      await this.getStudents(this.page_index, this.page_size);
    });
  }

  async getStudents(page: number, size: number) {
    try {
      this.activeMatProgressBar();

      const res = await firstValueFrom(this.studentService.getAllAvailableStudents(page, size));
      if (res.status !== 200) {
        this.openDialog("Student", res.message, ResponseTypeColor.ERROR, false);
        return;
      }

      const data = res.data[0].all_students;

      this.dataSource.data = data;
      this.totalCount = res.data[0].total_students;
      this.cdr.detectChanges();
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'image/default_student_photo.jpg'; // path to your default image
  }

  AddStudent() {
    window.location.href = "academic/register-student";
  }

  ViewStudent(student: any) {
    const dialogRef = this.dialog.open(ViewStudentComponent, {
      width: '1000px',
      height: 'max-content',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'responsive-dialog',
      data: student,
    });
  }

  DownloadAadharCard(student: any) {
    try {
      this.activeMatProgressBar();

      this.studentService.getStudentsAadharCardPhotoStream(student.student_guid).subscribe({
        next: (imageData: Blob) => {
          let center_document = URL.createObjectURL(imageData);
          this.hideMatProgressBar();

          const link = document.createElement('a');
          link.href = center_document;
          link.download = `${student.registration_number}_${StudentDocumentName.AADHAR_CARD_PHOTO}`;
          link.click();
          this.hideMatProgressBar();
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
        }
      });
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, false);
    }
  }

  EditStudent(id: any) {
    this.router.navigate(['academic/edit-student-details/' + id]);
  }

  PayFees(student: any) {
    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, { data: { text: "Do you want to pay fees for this student?<br><br>Registration No. : " + student.registration_number + "<br>Student Name : " + student.student_name } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.activeMatProgressBar();

        this.walletService.payFeesStudent(student.student_id).subscribe({
          next: (response) => {
            this.hideMatProgressBar();

            if (response.status === 200) {
              this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, false);
              this.getStudents(this.page_index, this.page_size);
            } else {
              this.openDialog("Student", response.message, ResponseTypeColor.ERROR, false);
            }
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      }
    });
  }

  RefundFees(student: any) {
    const dialogRef = this.dialog.open(CustomConfirmDialogWithRemarksComponent, { data: { text: "Do you want to refund fees for this student?<br><br>Registration No. : " + student.registration_number + "<br>Student Name : " + student.student_name } });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        if (result.status === true) {
          this.activeMatProgressBar();

          this.walletService.refundFeesStudent(student.student_id, result.remarks).subscribe({
            next: (response) => {
              this.hideMatProgressBar();

              if (response.status === 200) {
                this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, false);
                this.getStudents(this.page_index, this.page_size);
              } else {
                this.openDialog("Student", response.message, ResponseTypeColor.ERROR, false);
              }
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
            }
          });
        } else {
          return;
        }
      } else {
        return;
      }
    });
  }

  MarksUpdate(student: any) {
    this.router.navigate(['/control-panel/update-exam-marks/' + student.student_id]);
  }

  CerficiateIssued(student: any) {
    const dialogRef = this.dialog.open(IssueCertificateComponent, {
      width: '500px',
      height: 'max-content',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'responsive-dialog',
      data: student,
    });

    dialogRef.afterClosed().subscribe((result: File | undefined) => {
      if (result) {
        const formData = new FormData();
        formData.append("file", result);
        formData.append("student_id", student.student_id);

        this.activeMatProgressBar();

        this.studentCertificateService.issueCertificate(formData).subscribe({
          next: (response) => {
            this.hideMatProgressBar();

            if (response.status === 200) {
              this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, false);
              this.getStudents(this.page_index, this.page_size);
            } else {
              this.openDialog("Student", response.message, ResponseTypeColor.ERROR, false);
            }
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      } else {
        this.openDialog("Student", "Please select a certificate of pdf format", ResponseTypeColor.INFO, false);
      }
    });
  }

  DeleteStudent(student: any) {
    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, { data: { text: "Do you want to delete this student?<br><br>Registration No. : " + student.registration_number + "<br>Student Name : " + student.student_name } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.activeMatProgressBar();

        this.studentService.deleteStudent(student.student_id).subscribe({
          next: (response) => {
            this.hideMatProgressBar();

            if (response.status === 200) {
              this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, false);
              this.getStudents(this.page_index, this.page_size);
            } else {
              this.openDialog("Student", response.message, ResponseTypeColor.ERROR, false);
            }
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      }
    });
  }

  DownloadCertificate(student: any) {
    this.activeMatProgressBar();

    this.studentCertificateService.downloadCertificate(student.student_id).subscribe({
      next: (blob) => {
        this.hideMatProgressBar();

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = student.registration_number;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Internal server error/Certificate not found", ResponseTypeColor.ERROR, false);
      },
    });
  }

  downloadRegistrationCard(student: any) {
    this.activeMatProgressBar();
    
    this.studentService.downloadRegistrationCard(student.student_id).subscribe({
      next: (blob) => {
        this.hideMatProgressBar();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${student.registration_number}_registration_card.pdf`;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error?.message ?? "Failed to download registration card", ResponseTypeColor.ERROR, false);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetVerificationStatusLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
  }

  GetEnrollmentStatusLabel(value: string): string {
    return EnrollmentStatusDescriptions[value as EnrollmentStatus] || 'Unknown';
  }

  GetFormattedAddress(value: string): string {
    value = value.replace(/\n/g, '<br>');
    return value;
  }

  GetIsEmailVerifiedLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        window.location.reload();
      }
    });
  }
}
