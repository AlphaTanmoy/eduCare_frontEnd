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
}
