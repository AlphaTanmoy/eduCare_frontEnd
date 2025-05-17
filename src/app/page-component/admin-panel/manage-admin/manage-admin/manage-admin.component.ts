import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, AfterViewInit } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { faEdit, faEye, faDownload, faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, ApproveRejectionStatus, ApproveRejectionStatusDescriptions, FranchiseDocumentName, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminService } from '../../../../service/admin/admin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage-admin',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule, MatProgressBarModule],
  templateUrl: './manage-admin.component.html',
  styleUrl: './manage-admin.component.css'
})
export class ManageAdminComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  ApproveRejectionStatusDescriptions = ApproveRejectionStatusDescriptions;
  ApproveRejectionStatus = ApproveRejectionStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  faEdit = faEdit;
  faEye = faEye;
  faDownload = faDownload;
  faCircleInfo = faCircleInfo;
  faCircleXmark = faCircleXmark;

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 5;

  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;

  displayedColumns: string[] = ['admin_name', 'admin_contact_number', 'admin_email_id', 'admin_verification_status', 'data_status', 'created_at', 'action'];

  canApproveReject: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    await this.getAdmins();
  }

  async getAdmins() {
    this.adminService.GetAllAdmins().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          console.log(response.data);

          this.dataSource.data = response.data;
          this.totalCount = response.data.length;
        } catch (error) {
          this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, false);
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

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
  }

  GetApprovalStatusLabel(value: number): string {
    return ApproveRejectionStatusDescriptions[value as ApproveRejectionStatus] || 'Unknown';
  }

  GetFormattedAddress(value: string): string {
    value = value.replace(/\n/g, '<br>');
    return value;
  }

  EditAdmin(admin_id: string) {
    console.log(admin_id);
    window.location.href = "admin-panel/edit-admin/" + admin_id;
  }

  DeleteAdmin(admin_id: string) {
    console.log(admin_id)
    // this.activeMatProgressBar();

    // this.franchiseService.GetFileStreamByFolderAndFilename(center_id, FranchiseDocumentName.SUPPORTABLE_DOCUMENT).subscribe({
    //   next: async (blob: Blob) => {
    //     let center_document = URL.createObjectURL(blob);
    //     this.hideMatProgressBar();

    //     const link = document.createElement('a');
    //     link.href = center_document;
    //     link.download = `${FranchiseDocumentName.SUPPORTABLE_DOCUMENT}.pdf`;
    //     link.click();
    //   },
    //   error: (err) => {
    //     this.hideMatProgressBar();
    //     this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    //   }
    // });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  AddAdmin() {
    window.location.href = "admin-panel/create-admin";
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
        location.reload();
      }
    });
  }
}