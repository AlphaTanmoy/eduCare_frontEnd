import { Component, Inject, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {CreditDebit, CreditDebitDescriptions, TransactionType, TransactionTypeDescriptions } from '../../../../constants/commonConstants';

export interface TransactionData {
  _id?: string;
  referenceId?: string;
  transactionType?: string;
  creditDebit? : string;
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

  TransactionType = TransactionType;
  TransactionTypeDescriptions = TransactionTypeDescriptions;

  CreditDebit = CreditDebit;
  CreditDebitDescriptions = CreditDebitDescriptions;

  transaction: TransactionData = {} as TransactionData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewTransactionComponent>,
  ) {
    // Handle both direct transaction data and nested response structure
    if (data) {
      if (Array.isArray(data) && data.length > 0 && data[0].transaction) {
        // Handle case where data is an array with transaction object
        this.transaction = data[0].transaction;
      } else if (data.transaction) {
        // Handle case where data has a transaction property
        this.transaction = data.transaction;
      } else {
        // Handle case where data is already the transaction object
        this.transaction = data;
      }
    } else {
      console.error('No transaction data provided');
      this.transaction = {} as TransactionData;
    }
    console.log('Transaction data received:', this.transaction);
    this.bootstrapElements = loadBootstrap();
  }


  getTransactionTypeLabel(type?: string): string {
    if (!type) return 'N/A';
    return this.TransactionTypeDescriptions[type as keyof typeof this.TransactionTypeDescriptions] || type;
  }

  getCreditDebitLabel(type?: string): string {
    if (!type) return 'N/A';
    return this.CreditDebitDescriptions[type as keyof typeof this.CreditDebitDescriptions] || type;
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

  getTransactionTypeClass(transactionType?: string): string {
    if (!transactionType) return 'text-muted';

    const typeLower = transactionType.toLowerCase();
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

  getCreditDebitClass(creditDebit?: string): string {
    if (!creditDebit) return 'text-muted';

    const typeLower = creditDebit.toLowerCase();
    if (typeLower.includes('debit') || typeLower.includes('withdraw')) {
      return 'text-danger';
    } else if (typeLower.includes('credit') || typeLower.includes('deposit')) {
      return 'text-success';
    } else {
      return 'text-primary';
    }
  }

  GetCreditDebitLabel(value: string | undefined): string {
    return CreditDebitDescriptions[value as CreditDebit] || 'Unknown';
  }

  GetAmountTransactionTypeLabel(transactionType: string | undefined): string {
    if (!transactionType) return 'N/A';
    
    // Convert to title case and replace underscores with spaces
    return transactionType
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
