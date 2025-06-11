import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { WalletService } from '../../../../service/wallet/wallet.service';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { Dropdown, ResponseTypeColor, WalletAmountStatus, WalletAmountStatusDescriptions } from '../../../../constants/commonConstants';
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { convertBlobToBase64, GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { faEdit, faEye, faDownload, faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomConfirmDialogWithRemarksComponent } from '../../../../common-component/custom-confirm-dialog-with-remarks/custom-confirm-dialog-with-remarks.component';

@Component({
  selector: 'app-manage-wallet',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FontAwesomeModule,
    MatProgressBarModule,
    CustomSingleSelectSearchableDropdownComponent,
    MatTooltipModule
  ],
  templateUrl: './manage-wallet.component.html',
  styleUrl: './manage-wallet.component.css'
})
export class ManageWalletComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  faEdit = faEdit;
  faEye = faEye;
  faDownload = faDownload;
  faCircleInfo = faCircleInfo;
  faCircleXmark = faCircleXmark;

  WalletAmountStatus = WalletAmountStatus;
  WalletAmountStatusDescriptions = WalletAmountStatusDescriptions;

  available_franchises: Dropdown[] = [];
  associated_franchise_id: string | null = null;
  mat_table_header: string | null = null;
  is_mat_tables_data_loaded = false;

  page_size: number = 5;
  page_index: number = 0;

  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;
  wallet_balance: number = 0;

  displayedColumns: string[] = ['transaction_id', 'amount', 'status', 'approve_or_reject', 'createdAt', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  canApproveReject: boolean = false;
  approve_reject_items: string[] = [];

  constructor(
    private authService: AuthService,
    private franchiseService: FranchiseService,
    private walletService: WalletService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
    this.hideMatProgressBar();

    if (res.status !== 200) {
      this.openDialog("Wallet", res.message, ResponseTypeColor.ERROR, false);
      return;
    }

    res.data.forEach((element: any) => {
      this.available_franchises.push(new Dropdown(element.id, element.center_name));
    });
  }

  async getFranchises(page: number, size: number) {
    try {
      this.activeMatProgressBar();

      const res = await firstValueFrom(this.walletService.GetTransactionsWithPaginationByCenterId(this.associated_franchise_id, page, size));
      if (res.status !== 200) {
        this.openDialog("Wallet", res.message, ResponseTypeColor.ERROR, false);
        return;
      }

      console.log(res.data[0].transactions)

      this.dataSource.data = res.data[0].transactions;
      this.totalCount = res.data[0].total_transactions;
      this.wallet_balance = res.data[0].current_balance;
      this.is_mat_tables_data_loaded = true;
    } catch (error) {
      this.hideMatProgressBar();
      this.openDialog("Wallet", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  handleFranchiseSelection(selectedItem: any) {
    this.associated_franchise_id = selectedItem.id ?? null;
    this.mat_table_header = (selectedItem.text != null && selectedItem.text != "") ? "Transaction Details For [" + selectedItem.text + "]" : "";
    this.getFranchises(this.page_index, this.page_size);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(async (event) => {
      this.page_index = event.pageIndex;
      this.page_size = event.pageSize;
      await this.getFranchises(this.page_index, this.page_size);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async ApproveOrReject(operation: string) {
    let remarks = '';

    if (operation === WalletAmountStatus.REJECTED) {
      const dialogRef = this.dialog.open(CustomConfirmDialogWithRemarksComponent, { data: { text: "Do you want to reject?" } });

      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result) {
          if (result.status === true) {
            remarks = result.remarks;

            try {
              this.activeMatProgressBar();
              const res = await firstValueFrom(this.walletService.DoApproveOrReject(operation, remarks, this.approve_reject_items));

              if (res.status !== 200) {
                this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, false);
              } else {
                this.openDialog("Franchise", res.message, ResponseTypeColor.SUCCESS, true);
                await this.getFranchises(this.page_index, this.page_size);
                this.approve_reject_items = [];
              }
            } catch (error) {
              this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
            } finally {
              this.hideMatProgressBar();
            }
          } else {
            return;
          }
        } else {
          return;
        }
      });
    } else {
      try {
        this.activeMatProgressBar();
        const res = await firstValueFrom(this.walletService.DoApproveOrReject(operation, remarks, this.approve_reject_items));

        if (res.status !== 200) {
          this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, false);
        } else {
          this.openDialog("Franchise", res.message, ResponseTypeColor.SUCCESS, true);
          await this.getFranchises(this.page_index, this.page_size);
          this.approve_reject_items = [];
        }
      } catch (error) {
        this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
      } finally {
        this.hideMatProgressBar();
      }
    }
  }

  ApprovalRejectCheckboxChange(event: any, elemnt: any) {
    let is_checked = (event.target as HTMLInputElement).checked;

    if (is_checked) {
      this.approve_reject_items.push(elemnt._id);
    } else {
      this.approve_reject_items = this.approve_reject_items.filter(item => item !== elemnt._id);
    }

    if (this.approve_reject_items.length > 0) {
      this.canApproveReject = true;
    } else {
      this.canApproveReject = false;
    }
  }

  redirectToRechargeWallet() {
    window.location.href = "control-panel/wallet/recharge";
  }

  GetWalletAmountStatusLabel(value: string): string {
    return WalletAmountStatusDescriptions[value as WalletAmountStatus] || 'Unknown';
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  DownloadWalletTransactionProof(wallet_id: string, transaction_id: string) {
    this.activeMatProgressBar();

    this.walletService.GetWalletRechargeTransactionProofImage(wallet_id).subscribe({
      next: async (blob: Blob) => {
        let center_document = URL.createObjectURL(blob);
        this.hideMatProgressBar();

        const link = document.createElement('a');
        link.href = center_document;
        link.download = `${transaction_id}.jpg`;
        link.click();
        this.hideMatProgressBar();
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Wallet", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
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
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (reFetchNeeded) {

      }
    });
  }
}
