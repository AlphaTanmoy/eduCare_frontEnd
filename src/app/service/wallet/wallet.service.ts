import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private http: HttpClient) { }

  RechargeWallet(wallet: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.recharge_wallet, wallet);
  }

  GetTransactionsWithPaginationByCenterId(associated_franchise_id: string | null, page_number: number, page_size: number): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.get_available_transactions_per_franchise_by_offset, { associated_franchise_id, page_number, page_size });
  }

  getFranchiseTransactionLogs(franchiseId?: string): Observable<{
    status: number;
    responseType: string;
    apiPath: string;
    message: string;
    data: Array<{
      transactions: Array<{
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
        __v: number;
      }>;
      pagination: {
        total: number;
        page: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
      };
    }>;
  }> {
    let url = GetBaseURL() + Endpoints.wallet.franchise_transactions_logs;
    if (franchiseId) {
      url += `?franchiseId=${franchiseId}`;
    }
    return this.http.get<{
      status: number;
      responseType: string;
      apiPath: string;
      message: string;
      data: Array<{
        transactions: Array<{
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
          __v: number;
        }>;
        pagination: {
          total: number;
          page: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
          limit: number;
        };
      }>;
    }>(url);
  }

  DoApproveOrReject(status: string, notes: string, transaction_ids: string[]): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.approve_reject_wallet, { status, notes, transaction_ids });
  }

  GetWalletRechargeTransactionProofImage(transaction_id: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.wallet.get_wallet_recharge_transaction_proof + `/${transaction_id}`, { responseType: 'blob' });
  }

  UnblockFranchiseTransactions(franchiseId: string, transactionIds: string[]): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.unblock_franchise_transactions, { franchiseId, transactionIds });
  }

  PayStudentFees(paymentData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.pay_student_fees, paymentData);
  }

  RefundStudentFees(refundData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.wallet.refund_student_fees, refundData);
  }

  GetFranchiseTransactionLogs(franchiseId: string, page: number, limit: number, filters?: any): Observable<any> {
    // Build query parameters
    let params: any = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    // Only add franchiseId if it's provided
    if (franchiseId) {
      params.franchiseId = franchiseId;
    }

    return this.http.get<any>(GetBaseURL() + Endpoints.wallet.franchise_transactions_logs, { params });
  }
}
