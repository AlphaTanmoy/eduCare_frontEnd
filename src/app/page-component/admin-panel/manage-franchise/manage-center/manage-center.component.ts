import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, AfterViewInit } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { firstValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { faEdit, faEye, faDownload, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, ApproveRejectionStatus, ApproveRejectionStatusDescriptions, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ViewCenterHeadComponent } from '../view-center-head/view-center-head.component';

@Component({
  selector: 'app-manage-center',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule, MatProgressBarModule],
  templateUrl: './manage-center.component.html',
  styleUrl: './manage-center.component.css'
})
export class ManageCenterComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  ApproveRejectionStatusDescriptions = ApproveRejectionStatusDescriptions;
  ApproveRejectionStatus = ApproveRejectionStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  faEdit = faEdit;
  faEye = faEye;
  faDownload = faDownload;
  faCircleInfo = faCircleInfo;

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 5;
  page_index: number = 0;

  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;

  displayedColumns: string[] = ['center_name', 'center_contact_number', 'center_email_id', 'center_category', 'center_type', 'center_address', 'data_status', 'is_approved', 'approve_or_reject', 'created_at', 'action'];

  canApproveReject: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  approve_reject_items: string[] = [];

  constructor(
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    await this.getFranchises(this.page_index, this.page_size);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(async (event) => {
      this.page_index = event.pageIndex;
      this.page_size = event.pageSize;
      await this.getFranchises(this.page_index, this.page_size);
    });
  }

  async getFranchises(page: number, size: number) {
    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchises(page, size));
      if (res.status !== 200) {
        this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, false);
        return;
      }
      this.dataSource.data = res.data[0].franchises;
      this.totalCount = res.data[0].total_documents;
    } catch (error) {
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
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

  ApprovalRejectCheckboxChange(event: any, elemnt: any) {
    let is_checked = (event.target as HTMLInputElement).checked;

    if (is_checked) {
      this.approve_reject_items.push(elemnt.center_id);
    } else {
      this.approve_reject_items = this.approve_reject_items.filter(item => item !== elemnt.center_id);
    }

    if (this.approve_reject_items.length > 0) {
      this.canApproveReject = true;
    } else {
      this.canApproveReject = false;
    }
  }

  async ApproveOrReject(operation: number) {
    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.franchiseService.DoApproveOrReject(operation, this.approve_reject_items));
      if (res.status !== 200) {
        this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, false);
      } else {
        this.openDialog("Franchise", res.message, ResponseTypeColor.SUCCESS, true);
      }
    } catch (error) {
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  ViewFranchiseCenterHeadDetails(center_id: string,center_head_id: string) {
    const dialogRef = this.dialog.open(ViewCenterHeadComponent, {
      data: {
        center_id: center_id,
        center_head_id: center_head_id,
      }
    });
  }

  ViewFranchiseDocuments(center_id: string) {
    console.log(center_id);
  }

  EditFranchiseDetails(center_id: string) {
    console.log(center_id);
  }

  DownloadFranchiseDocuments(center_id: string) {
    console.log(center_id);
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, reFetchNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (reFetchNeeded) {
        await this.getFranchises(this.page_index, this.page_size);
      }
    });
  }
}
