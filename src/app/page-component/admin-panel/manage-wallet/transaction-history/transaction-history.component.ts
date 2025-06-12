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
import { Dropdown } from '../../../../constants/commonConstants';

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
    MatTooltipModule
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

  // Pagination
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  isDataLoaded = false;
  searchText = '';

  async ngOnInit(): Promise<void> {
    this.loadBootstrap();
    await this.loadFranchises();
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
        // Auto-select the first franchise if none selected
        if (this.franchises.length > 0 && !this.selectedFranchise) {
          this.selectedFranchise = this.franchises[0];
          await this.loadTransactions();
        }
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
    if (!this.selectedFranchise?.id) {
      this.dataSource.data = [];
      this.totalCount = 0;
      this.isDataLoaded = true;
      return;
    }

    this.matProgressBarVisible = true;
    this.isDataLoaded = false;

    try {
      const filters = this.searchText ? { search: this.searchText } : undefined;
      const response = await firstValueFrom(
        this.walletService.GetFranchiseTransactionLogs(
          this.selectedFranchise.id,
          this.pageIndex + 1,
          this.pageSize,
          filters
        )
      );

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue.trim().toLowerCase();
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadTransactions();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  viewTransaction(transaction: any): void {
    // TODO: Implement view transaction details
    console.log('View transaction:', transaction);
    this.showAlert('Transaction Details', `Transaction ID: ${transaction._id}\nAmount: ${this.formatCurrency(transaction.changedAmount)}\nStatus: ${transaction.status}`);
  }

  // Formatting helpers
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  formatCurrency(amount: number): string {
    return '₹' + (amount?.toFixed(2) || '0.00');
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning text-dark';
      case 'FAILED':
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case 'CREDIT':
        return 'text-success';
      case 'DEBIT':
        return 'text-danger';
      default:
        return 'text-info';
    }
  }

  // UI Helpers
  private showAlert(title: string, message: string): void {
    this.dialog.open(CustomAlertComponent, {
      width: '400px',
      data: { title, message }
    });
  }
}
