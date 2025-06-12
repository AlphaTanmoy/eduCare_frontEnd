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
import { AmountStatus, AmountStatusDescriptions, Dropdown, TransactionType, TransactionTypeDescriptions, UserRole } from '../../../../constants/commonConstants';
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
  status: string;
  referenceId: string;
  notes: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
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

  AmountStatus = AmountStatus;
  AmountStatusDescriptions = AmountStatusDescriptions;
  TransactionType = TransactionType;
  TransactionTypeDescriptions = TransactionTypeDescriptions;

  UserRole = UserRole;

  // Table data
  dataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = [
    'date',
    'referenceId',
    'type',
    'amount',
    'balance',
    'status',
    'notes',
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
      console.log('User role:', userRole);

      this.isFranchise = userRole?.toLowerCase() === 'franchise';
      this.isAdmin = [UserRole.MASTER, UserRole.ADMIN].includes(userRole?.toUpperCase() || '');

      console.log('isFranchise:', this.isFranchise, 'isAdmin:', this.isAdmin);

      if (this.isAdmin) {
        // For admin users, load franchises for selection
        await this.loadFranchises();
      } else if (this.isFranchise) {
        // For franchise users, directly load transactions without franchise selection
        console.log('Loading transactions for franchise user');
        await this.loadTransactions();
      } else {
        console.warn('User role not recognized or missing');
      }
    } catch (error) {
      console.error('Error initializing component:', error);
      this.showAlert('Error', 'Failed to initialize component. Please try again.');
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
      if (response && response.data) {
        this.franchises = response.data.map((f: any) => new Dropdown(f._id, f.center_name));
      }
    } catch (error) {
      console.error('Error loading franchises:', error);
      this.showAlert('Error', 'Failed to load franchises. Please try again.');
    } finally {
      this.matProgressBarVisible = false;
      this.cdr.detectChanges();
    }
  }

  async loadTransactions(): Promise<void> {
    console.log('loadTransactions called - isFranchise:', this.isFranchise, 'isAdmin:', this.isAdmin);
    this.matProgressBarVisible = true;
    this.isDataLoaded = false;

    try {
      // If admin and no franchise selected, show empty state
      if (this.isAdmin && !this.selectedFranchise?.id) {
        console.log('Admin user - no franchise selected, showing empty state');
        this.dataSource.data = [];
        this.totalCount = 0;
        this.walletBalance = '₹0.00';
        return;
      }

      let franchiseId: string | undefined;

      if (this.isAdmin) {
        // For admin users, use the selected franchise ID
        franchiseId = this.selectedFranchise?.id;
        console.log('Admin user - using franchiseId:', franchiseId);
      } else if (this.isFranchise) {
        // For franchise users, fetch their franchise ID from the API
        const userId = this.authService.getUserId();
        console.log('Franchise user - userId:', userId);

        if (userId) {
          try {
            console.log('Fetching franchise ID for user:', userId);
            const franchiseResponse = await firstValueFrom(
              this.franchiseService.GetFranchiseIdByUserId(userId)
            );
            console.log('Franchise ID response:', franchiseResponse);

            if (franchiseResponse?.data?._id) {
              franchiseId = franchiseResponse.data._id;
              console.log('Using franchiseId:', franchiseId);
            } else {
              console.error('No franchise ID found in response');
            }
          } catch (error) {
            console.error('Error fetching franchise ID:', error);
          }
        } else {
          console.error('No user ID found');
        }
      }

      console.log('Calling GetFranchiseTransactionLogs with:', {
        page: this.pageIndex + 1,
        limit: this.pageSize,
        franchiseId
      });

      const response = await firstValueFrom(
        this.walletService.GetFranchiseTransactionLogs(
          this.pageIndex + 1,
          this.pageSize,
          franchiseId
        )
      );

      console.log('API Response:', response);

      if (response?.data?.[0]?.transactions) {
        this.dataSource.data = response.data[0].transactions;
        this.totalCount = response.data[0].pagination?.total || 0;

        // Update wallet balance (assuming the latest transaction has the current balance)
        if (this.dataSource.data.length > 0) {
          const latestTx = this.dataSource.data[0];
          this.walletBalance = this.formatCurrency(latestTx.currentAmount);
        }
      } else {
        this.dataSource.data = [];
        this.totalCount = 0;
        this.walletBalance = '₹0.00';
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.showAlert('Error', 'Failed to load transaction history. Please try again.');
      this.dataSource.data = [];
      this.totalCount = 0;
      this.walletBalance = '₹0.00';
    } finally {
      this.matProgressBarVisible = false;
      this.isDataLoaded = true;
      this.cdr.detectChanges();
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
      console.error('Invalid transaction data:', transaction);
      this.showAlert('Error', 'Invalid transaction data');
      return;
    }

    try {
      this.matProgressBarVisible = true;
      console.log('Fetching transaction details for ID:', transaction._id);

      const response = await firstValueFrom(
        this.walletService.GetTransactionLogById(transaction._id)
      );

      console.log('Transaction details response:', response);

      // Extract transaction data from the response structure
      let transactionData = response?.responseType?.transaction || response?.data;

      // If transactionData is an array, take the first item
      if (Array.isArray(transactionData)) {
        transactionData = transactionData[0];
      }

      // If we still don't have transaction data, try to use the original transaction
      if (!transactionData) {
        console.warn('No transaction data in response, using original transaction data');
        transactionData = transaction;
      }

      if (transactionData) {
        // Import the ViewTransactionComponent dynamically to avoid circular dependencies
        const { ViewTransactionComponent } = await import('../view-transaction/view-transaction.component');

        // Log the data being passed to the dialog for debugging
        console.log('Opening dialog with transaction data:', transactionData);

        // Open the dialog with the transaction data
        const dialogRef = this.dialog.open(ViewTransactionComponent, {
          data: transactionData,
        });

        // Remove the header after the dialog is opened
        dialogRef.afterOpened().subscribe(() => {
          const dialogContainer = document.querySelector('.mat-mdc-dialog-container');
          if (dialogContainer) {
            const header = dialogContainer.querySelector('.mdc-dialog__header');
            if (header) {
              header.remove();
            }
          }
        });
      } else {
        console.warn('No transaction details found in response:', response);
        this.showAlert('No Details', 'No additional details available for this transaction.');
      }
    } catch (error: unknown) {
      console.error('Error viewing transaction:', error);
      let errorMessage = 'Please try again later.';

      if (error && typeof error === 'object') {
        const errorObj = error as { error?: { message?: unknown } };
        if (errorObj?.error && typeof errorObj.error === 'object' && 'message' in errorObj.error) {
          errorMessage = String(errorObj.error.message);
        }
      }

      this.showAlert('Error', `Failed to load transaction details. ${errorMessage}`);
    } finally {
      this.matProgressBarVisible = false;
    }
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetAmountStatusLabel(value: string): string {
    return AmountStatusDescriptions[value as AmountStatus] || 'Unknown';
  }

  GetTransactionTypeLabel(value: string): string {
    return TransactionTypeDescriptions[value as TransactionType] || 'Unknown';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge bg-secondary';

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'success':
      case 'completed':
      case 'approved':
        return 'text_card_success';
      case 'failed':
      case 'rejected':
      case 'declined':
        return 'text_card_danger';
      case 'pending':
      case 'processing':
        return 'text_card_idle';
      case 'refunded':
      case 'reversed':
        return 'text_card_idle';
      default:
        return 'text_card_idle';
    }
  }

  getTransactionTypeClass(type: string): string {
    if (!type) return 'text-muted';

    const typeLower = type.toLowerCase();
    if (typeLower.includes('debit') || typeLower.includes('withdraw')) {
      return 'text-danger';
    } else if (typeLower.includes('credit') || typeLower.includes('deposit')) {
      return 'text-success';
    } else {
      return 'text-primary';
    }
  }

  // Show alert dialog
  private showAlert(title: string, message: string): void {
    this.dialog.open(CustomAlertComponent, {
      data: {
        title,
        text: message,
        type: 3 // 3 is for error type
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, reFetchNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (reFetchNeeded) {

      }
    });
  }
}
