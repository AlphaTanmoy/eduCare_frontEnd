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
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faDownload, faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CreditDebit, CreditDebitDescriptions, Dropdown, ResponseTypeColor, TransactionType, TransactionTypeDescriptions, UserRole } from '../../../../constants/commonConstants';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';

interface Transaction {
  _id: string;
  date: string;
  currentAmount: number;
  changedAmount: number;
  effectedValue: number;
  franchiseId: string;
  miscData: string | null;
  walletId: string | null;
  transactionType: string;
  creditDebit: string;
  referenceId: string;
  notes: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

@Component({
  selector: 'app-transaction-history',
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
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
  standalone: true
})
export class TransactionHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);
  private walletService = inject(WalletService);
  private franchiseService = inject(FranchiseService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Icons
  faEye = faEye;
  faDownload = faDownload;
  faCircleInfo = faCircleInfo;
  faCircleXmark = faCircleXmark;

  TransactionType = TransactionType;
  TransactionTypeDescriptions = TransactionTypeDescriptions;
  CreditDebit = CreditDebit;
  CreditDebitDescriptions = CreditDebitDescriptions;

  UserRole = UserRole;

  // Table data
  dataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = [
    'date',
    'referenceId',
    'type',
    'transfer_amount',
    'old_balance',
    'new_balance',
    'transaction_effect',
    'actions'
  ];

  // Franchise data
  franchises: Dropdown[] = [];
  selectedFranchise: Dropdown | null = null;
  walletBalance: string = '₹0.00';
  isFranchise: boolean = false;
  isAdmin: boolean = false;

  // Pagination
  pageIndex = 0;
  pageSize = 5;
  totalCount = 0;
  isDataLoaded = false;
  searchText = '';

  ngOnInit(): void {
    this.loadBootstrap();
    this.initializeComponent();
  }

  private async initializeComponent(): Promise<void> {
    try {
      const userRole = this.authService.getUserRole();

      this.isFranchise = userRole?.toLowerCase() === 'franchise';
      this.isAdmin = [UserRole.MASTER, UserRole.ADMIN].includes(userRole?.toUpperCase() || '');

      if (this.isAdmin) {
        // For admin users, load franchises for selection
        await this.loadFranchises();
      } else if (this.isFranchise) {
        // For franchise users, directly load transactions without franchise selection
        await this.loadTransactions();
      } else {
        console.warn('User role not recognized or missing');
      }
    } catch (error: any) {
      this.openDialog("Wallet", error.error.message ?? "Failed to initialize page. Please try again.", ResponseTypeColor.ERROR, false);
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.loadTransactions();
      });
    }
  }

  ngOnDestroy() {
    removeBootstrap(this.bootstrapElements);
  }

  private loadBootstrap() {
    this.bootstrapElements = loadBootstrap();
  }

  async loadFranchises(): Promise<void> {
    this.matProgressBarVisible = true;
    try {
      const response = await firstValueFrom(this.franchiseService.getAllCentersBasicInfo());
      if (response.status !== 200) {
        this.openDialog("Wallet", response.message, ResponseTypeColor.ERROR, false);
        return;
      }

      if (response && response.data) {
        this.franchises = response.data.map((f: any) => new Dropdown(f._id, f.center_name));
      }
    } catch (error: any) {
      this.matProgressBarVisible = false;
      this.openDialog("Wallet", error.error.message ?? "Failed to load franchises. Please try again.", ResponseTypeColor.ERROR, false);
    } finally {
      this.matProgressBarVisible = false;
      this.cdr.detectChanges();
    }
  }

  async loadTransactions(): Promise<void> {
    this.activeMatProgressBar();
    this.isDataLoaded = false;

    try {
      // If admin and no franchise selected, show empty state
      if (this.isAdmin && !this.selectedFranchise?.id) {
        this.dataSource.data = [];
        this.totalCount = 0;
        this.walletBalance = '₹0.00';
        return;
      }

      let franchiseId: string | undefined;

      if (this.isAdmin) {
        // For admin users, use the selected franchise ID
        franchiseId = this.selectedFranchise?.id;
      } else if (this.isFranchise) {
        // For franchise users, fetch their franchise ID from the API
        const userId = this.authService.getUserId();

        if (userId) {
          try {
            const franchiseResponse = await firstValueFrom(this.franchiseService.GetFranchiseIdByUserId(userId));
            this.hideMatProgressBar();

            if (franchiseResponse.status !== 200) {
              this.openDialog("Wallet", franchiseResponse.message, ResponseTypeColor.ERROR, false);
              return;
            }

            if (franchiseResponse?.data && franchiseResponse.data.length > 0) {
              franchiseId = franchiseResponse.data[0];
            } else {
              this.openDialog("Wallet", "No franchise ID found in response", ResponseTypeColor.ERROR, false);
            }
          } catch (error: any) {
            this.hideMatProgressBar();
            this.openDialog("Wallet", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
          }
        } else {
          this.hideMatProgressBar();
          this.openDialog("Wallet", "No user ID found", ResponseTypeColor.ERROR, false);
        }
      }

      this.activeMatProgressBar();
      const response = await firstValueFrom(this.walletService.GetFranchiseTransactionLogs(this.pageIndex + 1, this.pageSize, franchiseId));

      this.hideMatProgressBar();
      if (response.status !== 200) {
        this.openDialog("Wallet", response.message, ResponseTypeColor.ERROR, false);
        return;
      }

      if (response?.data?.[0]?.transactions) {
        this.dataSource.data = response.data[0].transactions;
        this.totalCount = response.data[0].pagination?.total || 0;

        this.walletBalance = this.formatCurrency(response.data[0].wallet_balance);
      } else {
        this.dataSource.data = [];
        this.totalCount = 0;
        this.walletBalance = '₹0.00';
      }
    } catch (error: any) {
      this.hideMatProgressBar();
      this.openDialog("Wallet", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
      this.dataSource.data = [];
      this.totalCount = 0;
      this.walletBalance = '₹0.00';
    } finally {
      this.isDataLoaded = true;
      this.hideMatProgressBar();
    }
  }

  handleFranchiseSelection(selectedFranchise: Dropdown | null): void {
    this.selectedFranchise = selectedFranchise;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadTransactions();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async viewTransaction(transaction: Transaction): Promise<void> {
    if (!transaction?._id) {
      this.openDialog("Wallet", "Invalid transaction data", ResponseTypeColor.INFO, false);
      return;
    }

    try {
      this.activeMatProgressBar();
      const response = await firstValueFrom(this.walletService.GetTransactionLogById(transaction._id));
      this.hideMatProgressBar();

      if (response.status !== 200) {
        this.openDialog("Wallet", response.message, ResponseTypeColor.ERROR, false);
        return;
      }


      let transactionData = response?.responseType?.transaction || response?.data;

      if (Array.isArray(transactionData)) {
        transactionData = transactionData[0];
      }

      // If we still don't have transaction data, try to use the original transaction
      if (!transactionData) {
        transactionData = transaction;
      }

      if (transactionData) {
        const { ViewTransactionComponent } = await import('../view-transaction/view-transaction.component');

        const dialogRef = this.dialog.open(ViewTransactionComponent, {
          width: '1000px',
          height: 'max-content',
          maxWidth: '95vw',
          maxHeight: '95vh',
          panelClass: 'responsive-dialog',
          data: transactionData,
        });
      } else {
        this.openDialog("Wallet", "No additional details available for this transaction", ResponseTypeColor.INFO, false);
      }
    } catch (error: any) {
      this.hideMatProgressBar();
      this.openDialog("Wallet", error.error.message ?? "Failed to load franchises. Please try again.", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  formatCurrency(amount: number): string {
    if (amount === null || amount === undefined) return '₹+0.00';
    return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getChangeAmontInnerHTML(transaction: any) {
    if (transaction.changedAmount === null || transaction.changedAmount === undefined) return '₹+0.00';

    return '₹' + ((transaction.changedAmount ?? 0) >= 0 ? '+' : '') + transaction.changedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  GetTransactionTypeLabel(value: string): string {
    return TransactionTypeDescriptions[value as TransactionType] || 'Unknown';
  }

  getCreditDebitClass(status: string): string {
    if (status === CreditDebit.CREDIT) {
      return 'credit_text';
    } else if (status === CreditDebit.DEBIT) {
      return 'debit_text';
    }
    return 'no_effect_text';
  }

  GetCreditDebitLabel(value: string): string {
    return CreditDebitDescriptions[value as CreditDebit] || 'Unknown';
  }

  getTransactionTypeClass(type: string): string {
    if (type === TransactionType.RECHARGE) {
      return 'text_card_primary';
    } else if (type === TransactionType.APPROVE_RECHARGE || type === TransactionType.STUDENT_FEE_PAYMENT) {
      return 'text_card_success';
    } else if (type === TransactionType.REJECT_RECHARGE || type === TransactionType.STUDENT_FEE_REFUND) {
      return 'text_card_deleted';
    } else if (type === TransactionType.BLOCKED_TRANSACTION) {
      return 'text_card_danger';
    }

    return 'text_card_primary_light';
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
