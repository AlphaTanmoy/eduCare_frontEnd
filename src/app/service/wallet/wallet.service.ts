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
}
