import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, AfterViewInit } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FranchiseService } from '../../../service/franchise/franchise.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { firstValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetFormattedCurrentDatetime } from '../../../utility/common-util';
import { faEdit, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, ApproveRejectionStatus, ApproveRejectionStatusDescriptions } from '../../../constants/commonConstants';

@Component({
  selector: 'app-manage-franchise',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule],
  templateUrl: './manage-franchise.component.html',
  styleUrl: './manage-franchise.component.css'
})
export class ManageFranchiseComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  ApproveRejectionStatusDescriptions = ApproveRejectionStatusDescriptions;
  ApproveRejectionStatus = ApproveRejectionStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  faEdit = faEdit;
  faEye = faEye;
  faDownload = faDownload;

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 2;
  page_index: number = 0;

  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;

  displayedColumns: string[] = ['center_name', 'center_contact_number', 'center_email_id', 'center_category', 'center_type', 'center_address', 'data_status', 'is_approved', 'approve_or_reject', 'created_at', 'action'];

  canAOrpproveReject : boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      this.dataSource.data = res.data[0].franchises;
      this.totalCount = res.data[0].total_documents;
      console.log(res.data)
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
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
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}