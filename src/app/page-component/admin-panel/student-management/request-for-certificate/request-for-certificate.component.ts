import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap } from '../../../../../load-bootstrap';
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
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';


@Component({
  selector: 'app-request-for-certificate',
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatProgressBarModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './request-for-certificate.component.html',
  styleUrl: './request-for-certificate.component.css'
})
export class RequestForCertificateComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  role: string | null = null;
  UserRole = UserRole;

  CertificateTicketStatus = CertificateTicketStatus;
  CertificateTicketStatusDescriptions = CertificateTicketStatusDescriptions;

  eligible_student_list: any[] = [];
  all_raised_ticket_list: any[] = [];
  all_accepted_ticket_list: any[] = [];
  all_rejected_ticket_list: any[] = [];
  all_processing_ticket_list: any[] = [];
  all_completed_ticket_list: any[] = [];
  all_pubished_ticket_list: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentCertificateService: StudentCertificateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.role = this.authService.getUserRole();

    if (this.role === UserRole.ADMIN || this.role === UserRole.MASTER) {
      this.openDialog("Marks Update", "You are viewing this page as a Master/Admin. Features are disabled for you.", ResponseTypeColor.INFO, null);
    } else if (this.role === UserRole.FRANCHISE) {
      this.FetchEligibleStudentListForRaisingTicket();
      this.FetchAllAvailableRaisedTicketList();
    }
  }

  FetchEligibleStudentListForRaisingTicket() {
    this.activeMatProgressBar();

    this.studentCertificateService.getEligibleStudentListForRaisingTicket().subscribe({
      next: (response: any) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.eligible_student_list = response.data;
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

  FetchAllAvailableRaisedTicketList() {
    this.activeMatProgressBar();

    this.studentCertificateService.getAvailableCertificateTicketList([]).subscribe({
      next: (response: any) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.all_raised_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PENDING);
          this.all_accepted_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.ACCEPTED);
          this.all_rejected_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.REJECTED);
          this.all_processing_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PROCESSING);
          this.all_completed_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.COMPLETED);
          this.all_pubished_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PUBLISHED);
          console.log(this.all_pubished_ticket_list)
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

  RaiseTicket() {
    this.activeMatProgressBar();

    this.studentCertificateService.raiseTicketForCertificateGeneration().subscribe({
      next: (response: any) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
          this.FetchEligibleStudentListForRaisingTicket();
          this.FetchAllAvailableRaisedTicketList();
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

  PublishTicket(ticket: any){
    this.activeMatProgressBar();

    this.studentCertificateService.publishTicket(ticket._id).subscribe({
      next: (response: any) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
          this.FetchEligibleStudentListForRaisingTicket();
          this.FetchAllAvailableRaisedTicketList();
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

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetVerificationStatusLabel(value: string): string {
    return CertificateTicketStatusDescriptions[value as CertificateTicketStatus] || 'Unknown';
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
