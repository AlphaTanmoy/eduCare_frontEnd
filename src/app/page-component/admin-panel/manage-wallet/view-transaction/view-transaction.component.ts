import { Component, Inject, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AmountStatus, AmountStatusDescriptions, TransactionType, TransactionTypeDescriptions } from '../../../../constants/commonConstants';

export interface TransactionData {
  _id?: string;
  referenceId?: string;
  status?: string;
  transactionType?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  changedAmount?: number;
  currentAmount?: number;
  effectedValue?: string | number;
  franchiseId?: string;
  walletId?: string;
  createdBy?: string;
  notes?: string;
  miscData?: any;
}

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    FontAwesomeModule
  ],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent implements OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  faTimes = faTimes;

  AmountStatus = AmountStatus;
  AmountStatusDescriptions = AmountStatusDescriptions;
  TransactionType = TransactionType;
  TransactionTypeDescriptions = TransactionTypeDescriptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TransactionData,
    public dialogRef: MatDialogRef<ViewTransactionComponent>,
  ) {
    // Ensure we have valid data
    if (!this.data) {
      console.error('No transaction data provided');
      this.data = {} as TransactionData;
    }
    console.log('Transaction data received:', this.data);
    this.bootstrapElements = loadBootstrap();
  }


  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? 'Invalid date'
        : date.toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  formatCurrency(amount: number | undefined | null): string {
    const value = amount ?? 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  getStatusClass(status: string | undefined): string {
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

  GetAmountStatusLabel(value: string | undefined): string {
    return AmountStatusDescriptions[value as AmountStatus] || 'Unknown';
  }

  getTransactionTypeClass(type?: string): string {
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

  GetTransactionTypeLabel(value: string | undefined): string {
    return TransactionTypeDescriptions[value as TransactionType] || 'Unknown';
  }

  getMiscData(): any {
    if (!this.data?.miscData) return null;

    try {
      // If it's already an object, return it directly
      if (typeof this.data.miscData === 'object') {
        return this.data.miscData;
      }

      // Try to parse it as JSON
      return JSON.parse(this.data.miscData);
    } catch (error) {
      console.error('Error parsing miscData:', error);
      return { rawData: this.data.miscData };
    }
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getObjectKeys(obj: any): string[] {
    if (!this.isObject(obj)) {
      return [];
    }
    return Object.keys(obj);
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }
}
