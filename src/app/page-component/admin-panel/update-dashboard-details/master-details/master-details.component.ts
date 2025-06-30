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

interface MasterDataUpdate {
  master_data_type: string;
  master_data_value: string;
}

interface MasterDataResponse {
  status: number;
  message: string;
  data: any;
}

interface MasterDataUpdate {
  master_data_type: string;
  master_data_value: string;
}

interface MasterDataResponse {
  status: number;
}
@Component({
  selector: 'app-master-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './master-details.component.html',
  styleUrls: ['./master-details.component.css']
})

export class MasterDetailsComponent implements OnInit, OnDestroy {
  email: string = "";
  phone1: string = "";
  phone2: string = "";
  facebook: string = "";
  youtube: string = "";
  whatsapp: string = "";
  totalFranchise: string = "0";
  happyStudent: string = "0";
  totalStudent: string = "0";

  readonly dialog = inject(MatDialog);
  matProgressBarVisible: boolean = false;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) { }

  private loadMasterData(forceRefresh: boolean = false): void {
    this.dashboardService.getAllDashboardMasterData(forceRefresh).subscribe({
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
              if (item.master_data_type === MasterDataType.TOTAL_FRANCHISE) {
                this.totalFranchise = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.HAPPY_STUDENT) {
                this.happyStudent = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.TOTAL_STUDENT) {
                this.totalStudent = item.master_data_value;
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

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.loadMasterData();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  saveAll(): void {
    // Validate required fields
    if (!this.email || this.email.trim().length === 0) {
      this.openDialog("Master Data", "Email ID is required", ResponseTypeColor.ERROR, false);
      return;
    }
    if (!this.phone1 || this.phone1.trim().length === 0) {
      this.openDialog("Master Data", "Primary phone number is required", ResponseTypeColor.ERROR, false);
      return;
    }
    if (!this.phone2 || this.phone2.trim().length === 0) {
      this.openDialog("Master Data", "Secondary phone number is required", ResponseTypeColor.ERROR, false);
      return;
    }
    if (!this.facebook || this.facebook.trim().length === 0) {
      this.openDialog("Master Data", "Facebook URL is required", ResponseTypeColor.ERROR, false);
      return;
    }
    if (!this.youtube || this.youtube.trim().length === 0) {
      this.openDialog("Master Data", "YouTube URL is required", ResponseTypeColor.ERROR, false);
      return;
    }
    if (!this.whatsapp || this.whatsapp.trim().length === 0) {
      this.openDialog("Master Data", "WhatsApp URL is required", ResponseTypeColor.ERROR, false);
      return;
    }

    this.activeMatProgressBar();

    const masterDataUpdates: MasterDataUpdate[] = [
      { master_data_type: 'EMAIL', master_data_value: this.email },
      { master_data_type: 'PRIMARY_PHONE', master_data_value: this.phone1 },
      { master_data_type: 'SECONDARY_PHONE', master_data_value: this.phone2 },
      { master_data_type: 'FACEBOOK', master_data_value: this.facebook },
      { master_data_type: 'YOUTUBE', master_data_value: this.youtube },
      { master_data_type: 'WHATSAPP', master_data_value: this.whatsapp },
      { master_data_type: 'TOTAL_FRANCHISE', master_data_value: this.totalFranchise },
      { master_data_type: 'HAPPY_STUDENT', master_data_value: this.happyStudent },
      { master_data_type: 'TOTAL_STUDENT', master_data_value: this.totalStudent }
    ];

    this.dashboardService.updateDashboardMasterData({ masterDataUpdates }).subscribe({
      next: (response: MasterDataResponse) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Master Data", "All settings saved successfully!", ResponseTypeColor.SUCCESS, true);
          return;
        }

        this.openDialog("Master Data", response.message || "Failed to save settings", ResponseTypeColor.ERROR, false);
      },
      error: (err: any) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Failed to save settings. Please try again.", ResponseTypeColor.ERROR, false);
      }
    });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (pageReloadNeeded) {
        // Instead of reloading the entire page, just refresh the data
        this.loadMasterData(true);
      }
    });
  }

  private activeMatProgressBar(): void {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  private hideMatProgressBar(): void {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }
}
