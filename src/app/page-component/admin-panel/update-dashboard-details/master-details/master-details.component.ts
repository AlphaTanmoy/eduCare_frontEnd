import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../service/admin/admin.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDBItemKey, MasterDataType, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';

@Component({
  selector: 'app-master-details',
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './master-details.component.html',
  styleUrl: './master-details.component.css'
})

export class MasterDetailsComponent implements OnInit, OnDestroy {
  email: string = "";
  phone1: string = "";
  phone2: string = "";
  facebook: string = "";
  youtube: string = "";
  whatsapp: string = "";

  readonly dialog = inject(MatDialog);
  matProgressBarVisible: boolean = false;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();

    this.dashboardService.getAllDashboardMasterData().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Dashboard", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          for (let item of response.data) {
            if (item && item.master_data_value !== null && item.master_data_value !== undefined && item.master_data_value.trim().length > 0) {
              if (item.master_data_type === MasterDataType.EMAIL) {
                this.email = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.PRIMARY_PHONE) {
                this.phone1 = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.SECONDARY_PHONE) {
                this.phone2 = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.FACEBOOK) {
                this.facebook = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.YOUTUBE) {
                this.youtube = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.WHATSAPP) {
                this.whatsapp = item.master_data_value;
              }
            }
          }
        } catch (error) {
          this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  saveEmail(): void {
    if (!this.email || this.email.trim().length === 0) {
      this.openDialog("Master Data", "Email ID is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardEmailID(this.email).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  savePhone1(): void {
    if (!this.phone1 || this.phone1.trim().length === 0) {
      this.openDialog("Master Data", "Primary phone number is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardPhone1(this.phone1).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  savePhone2(): void {
    if (!this.phone2 || this.phone2.trim().length === 0) {
      this.openDialog("Master Data", "Secondary phone number is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardPhone2(this.phone2).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  saveFacebook(): void {
    if (!this.facebook || this.facebook.trim().length === 0) {
      this.openDialog("Master Data", "Facebook url is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardFacebook(this.facebook).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  saveYoutube(): void {
    if (!this.youtube || this.youtube.trim().length === 0) {
      this.openDialog("Master Data", "Youtube url is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardYoutube(this.youtube).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  saveWhatsapp(): void {
    if (!this.whatsapp || this.whatsapp.trim().length === 0) {
      this.openDialog("Master Data", "Whatsapp url is required", ResponseTypeColor.ERROR, false);
      return;
    }
    this.activeMatProgressBar();

    this.adminService.UploadDashboardWhatsapp(this.whatsapp).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
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
}
