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
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-download-excel-to-generate-certificate',
  imports: [CommonModule, FormsModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './download-excel-to-generate-certificate.component.html',
  styleUrl: './download-excel-to-generate-certificate.component.css'
})
export class DownloadExcelToGenerateCertificateComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  student_registration_number: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private studentCertificateService: StudentCertificateService
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  GenerateAndDownloadExcelOfAllStudents() {
    this.activeMatProgressBar();

    const info = {
      "status": "ALL",
      "student_registration_number": null
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
        this.hideMatProgressBar();
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err?.error?.message ?? "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
      }
    });
  }

  GenerateAndDownloadExcelOfTypedStudent() {
    this.activeMatProgressBar();

    const info = {
      "status": "SINGLE",
      "student_registration_number": this.student_registration_number
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
          this.hideMatProgressBar();
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
          } catch (e) {
            this.openDialog("Download Excel", "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
          }

          this.openDialog("Download Excel", errorMessage, ResponseTypeColor.ERROR, null);
        }
      });
    } catch (err) {
      this.hideMatProgressBar();
      this.openDialog("Download Excel", "Failed to generate certificate related excel file", ResponseTypeColor.ERROR, null);
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
