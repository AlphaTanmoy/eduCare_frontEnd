import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentCertificateService } from '../../../../service/student-certificate/student-certificate.service';
import { CertificateTicketStatus, CertificateTicketStatusDescriptions, Dropdown, ResponseTypeColor } from '../../../../constants/commonConstants';
import { HttpResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { firstValueFrom } from 'rxjs';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { CustomMultiSelectDropdownComponent } from '../../../../common-component/custom-multi-select-dropdown/custom-multi-select-dropdown.component';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CustomConfirmDialogWithRemarksComponent } from '../../../../common-component/custom-confirm-dialog-with-remarks/custom-confirm-dialog-with-remarks.component';

@Component({
  selector: 'app-download-excel-to-generate-certificate',
  imports: [
    MatTooltipModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FontAwesomeModule,
    MatProgressBarModule,
    CustomMultiSelectDropdownComponent,
    MatTooltipModule
  ],
  templateUrl: './download-excel-to-generate-certificate.component.html',
  styleUrl: './download-excel-to-generate-certificate.component.css'
})
export class DownloadExcelToGenerateCertificateComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  matProgressBarVisible1 = false;
  matProgressBarVisible2 = false;
  matProgressBarVisible3 = false;
  readonly dialog = inject(MatDialog);

  faDownload = faDownload;

  student_registration_number: string | null = null;
  CertificateTicketStatus = CertificateTicketStatus;
  CertificateTicketStatusDescriptions = CertificateTicketStatusDescriptions;

  available_franchises: Dropdown[] = [];
  franchise_ids: string[] = [];
  all_raised_ticket_list: any[] = [];
  all_accepted_ticket_list: any[] = [];
  all_rejected_ticket_list: any[] = [];
  all_processing_ticket_list: any[] = [];
  all_completed_ticket_list: any[] = [];
  all_pubished_ticket_list: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private franchiseService: FranchiseService,
    private studentCertificateService: StudentCertificateService
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.getFranchises();
  }

  async getFranchises() {
    const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
    this.hideMatProgressBar();

    if (res.status !== 200) {
      this.openDialog("Student", res.message, ResponseTypeColor.ERROR, null);
      return;
    }

    res.data.forEach((element: any) => {
      this.available_franchises.push(new Dropdown(element.id, element.center_name));
    });
  }

  FetchAllAvailableRaisedTicketList() {
    this.activeMatProgressBar();

    this.studentCertificateService.getAvailableCertificateTicketList(this.franchise_ids).subscribe({
      next: (response: any) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.all_raised_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PENDING);
          this.all_accepted_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.ACCEPTED);
          this.all_rejected_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.REJECTED);
          this.all_processing_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PROCESSING);
          this.all_completed_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.COMPLETED);
          this.all_pubished_ticket_list = response.data.filter((item: any) => item.data_status === CertificateTicketStatus.PUBLISHED);
          console.log(this.all_raised_ticket_list)
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

  handleSelectedFranchises(selectedItems: Dropdown[]) {
    this.franchise_ids = selectedItems.map((item: Dropdown) => item.id ?? "");
    this.FetchAllAvailableRaisedTicketList();
  }

  GenerateAndDownloadExcelOfTypedStudent() {
    this.activeMatProgressBar();

    const info = {
      "status": "SINGLE",
      "student_registration_number": this.student_registration_number,
      "ticket_id": null
    }

    try {
      this.studentCertificateService.downloadExcelRelatedToCertificateIssue(info).subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = response.body!;

          const contentDisposition = response.headers.get('Content-Disposition') || '';
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const match = filenameRegex.exec(contentDisposition);
          const filename = match && match[1] ? match[1].replace(/['"]/g, '') : 'Excel_Related_to_Certificate_Issue.xlsx';

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();

          URL.revokeObjectURL(link.href);
          this.DownloadZipOSingleStudentPhoto();
        },
        error: async (err) => {
          this.hideMatProgressBar();

          let errorMessage = "Failed to generate certificate related excel file";

          try {
            // Try to parse JSON error only if it's not already an object
            if (err.error instanceof Blob) {
              const errorText = await err.error.text();
              const parsedError = JSON.parse(errorText);
              errorMessage = parsedError.details || parsedError.message || errorMessage;
            } else if (typeof err.error === 'object') {
              errorMessage = err.error.details || err.error.message || errorMessage;
            }

            this.openDialog("Download Excel", errorMessage, ResponseTypeColor.ERROR, null);
          } catch (e) {
            this.openDialog("Download Excel", "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
          }
        }
      });
    } catch (err) {
      this.hideMatProgressBar();
      this.openDialog("Download Excel", "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
    }
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetVerificationStatusLabel(value: string): string {
    return CertificateTicketStatusDescriptions[value as CertificateTicketStatus] || 'Unknown';
  }

  AcceptRejectTicket(_ticketid: string, status: string) {
    if (status === CertificateTicketStatus.REJECTED) {
      const dialogRef = this.dialog.open(CustomConfirmDialogWithRemarksComponent, { data: { text: "Please enter the reason for rejecting this ticket" } });

      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result) {
          if (result.status === true) {
            this.activeMatProgressBar1();

            this.studentCertificateService.acceptOrRejectTicket(_ticketid, status, result.remarks).subscribe({
              next: (response: any) => {
                this.hideMatProgressBar1();

                if (response.status === 200) {
                  this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
                  this.FetchAllAvailableRaisedTicketList();
                } else {
                  this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
                }
              },
              error: (err) => {
                this.hideMatProgressBar1();
                this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
              }
            });
          } else {
            return;
          }
        } else {
          return;
        }
      });
    } else {
      this.activeMatProgressBar1();

      this.studentCertificateService.acceptOrRejectTicket(_ticketid, status, null).subscribe({
        next: (response: any) => {
          this.hideMatProgressBar1();

          if (response.status === 200) {
            this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
            this.FetchAllAvailableRaisedTicketList();
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

  }

  DownloadExcelOfTicket(ticket: any, progressBarType: number) {
    const _ticketid = ticket._id;
    if (progressBarType === 2) this.activeMatProgressBar2();
    if (progressBarType === 3) this.activeMatProgressBar3();

    const info = {
      "status": "TICKET",
      "student_registration_number": null,
      "ticket_id": _ticketid
    }

    this.studentCertificateService.downloadExcelRelatedToCertificateIssue(info).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body!;

        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const match = filenameRegex.exec(contentDisposition);
        const filename = match && match[1] ? match[1].replace(/['"]/g, '') : 'Excel_Related_to_Certificate_Issue.xlsx';

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        URL.revokeObjectURL(link.href);
        this.DownloadZipOfAllStudentPhotoOfFullTicket(ticket, progressBarType);
      },
      error: (err) => {
        if (progressBarType === 2) this.hideMatProgressBar2();
        if (progressBarType === 3) this.hideMatProgressBar3();

        this.openDialog("Student", err?.error?.message ?? "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
      }
    });
  }

  DownloadZipOSingleStudentPhoto() {
    try {
      this.studentCertificateService.downloadZipOfSingleStudentPhoto(this.student_registration_number).subscribe({
        next: (response: any) => {
          const blob = response.body;
          if (!blob) return;

          const contentDisposition = response.headers.get('Content-Disposition') || '';
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          const filename = filenameMatch && filenameMatch[1]
            ? filenameMatch[1].replace(/['"]/g, '')
            : 'download.zip';

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          this.hideMatProgressBar();
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Student", err?.error?.message ?? "Failed to generate student photo's zip for certificate related excel file", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (e) {
      this.hideMatProgressBar();
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, null);
    }
  }

  DownloadZipOfAllStudentPhotoOfFullTicket(ticket: any, progressBarType: number) {
    const _ticketid = ticket._id;

    try {
      this.studentCertificateService.downloadZipOfAllStudentPhotoOfFullTicket(_ticketid).subscribe({
        next: (response: any) => {
          const blob = response.body;
          if (!blob) return;

          const contentDisposition = response.headers.get('Content-Disposition') || '';
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          const filename = filenameMatch && filenameMatch[1]
            ? filenameMatch[1].replace(/['"]/g, '')
            : 'download.zip';

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          if (progressBarType === 2) this.hideMatProgressBar2();
          if (progressBarType === 3) this.hideMatProgressBar3();

          if (ticket.data_status === this.CertificateTicketStatus.ACCEPTED) this.FetchAllAvailableRaisedTicketList();
        },
        error: (err) => {
          if (progressBarType === 2) this.hideMatProgressBar2();
          if (progressBarType === 3) this.hideMatProgressBar3();
          this.openDialog("Student", err?.error?.message ?? "Failed to generate student photo's zip for certificate related excel file", ResponseTypeColor.ERROR, null);
        }
      });
    } catch (e) {
      if (progressBarType === 2) this.hideMatProgressBar2();
      if (progressBarType === 3) this.hideMatProgressBar3();
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, null);
    }
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

  activeMatProgressBar2() {
    this.matProgressBarVisible2 = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar2() {
    this.matProgressBarVisible2 = false;
    this.cdr.detectChanges();
  }

  activeMatProgressBar3() {
    this.matProgressBarVisible3 = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar3() {
    this.matProgressBarVisible3 = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
