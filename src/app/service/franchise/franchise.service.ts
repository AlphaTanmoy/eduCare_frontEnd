import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {
  constructor(private http: HttpClient) { }

  AddCenterHead(center_head_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.add_center_head_details, { data: center_head_details });
  }

  AddCenter(center_head: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.add_center_details, { data: center_head });
  }
}
