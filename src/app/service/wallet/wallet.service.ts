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

  GetFranchiseTransactionLogs(page: number, limit: number, franchiseId?: string): Observable<any> {
    let params: any = {
      page: page,
      limit: limit,
    };

    if (franchiseId) {
      params.franchiseId = franchiseId;
    }

    return this.http.get<any>(GetBaseURL() + Endpoints.wallet.franchise_transactions_logs, { params });
  }

  GetTransactionLogById(transactionId: string): Observable<any> {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    return this.http.get<any>(`${GetBaseURL()}${Endpoints.wallet.transaction_log_by_id}/${transactionId}`);
  }
}
