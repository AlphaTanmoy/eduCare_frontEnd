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
import { faEdit, faCircleXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, YesNoStatus, YesNoStatusDescriptions, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminService } from '../../../../service/admin/admin.service';
import { firstValueFrom } from 'rxjs';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-manage-admin',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule, MatProgressBarModule],
  templateUrl: './manage-admin.component.html',
  styleUrl: './manage-admin.component.css'
})
export class ManageAdminComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  YesNoStatusDescriptions = YesNoStatusDescriptions;
  YesNoStatus = YesNoStatus;

  faEdit = faEdit;
  faTrash = faTrash;
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
    this.activeMatProgressBar();

    this.adminService.GetAllAdmins().subscribe({
      next: (response) => {
        try {
          this.hideMatProgressBar();
          if (response.status !== 200) {
            this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          this.dataSource.data = response.data;
          this.totalCount = response.data.length;
        } catch (error) {
          this.hideMatProgressBar();
          this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
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

  GetVerificationStatusLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
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
    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, {
      data: { text: "Do you want to delete this admin?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.activeMatProgressBar();

        this.adminService.DeleteAdmin(admin_id).subscribe({
          next: (response) => {
            try {
              this.hideMatProgressBar();

              if (response.status === 200) {
                this.openDialog("Admin", response.message, ResponseTypeColor.SUCCESS, true);
              } else {
                this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, false);
              }
            } catch (error: any) {
              this.hideMatProgressBar();
              this.openDialog("Admin", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
            }
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      }
    });
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
        this.getAdmins();
      }
    });
  }
}