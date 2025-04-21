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

  UploadFranchiseDocument(center_id: string, file: File, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('center_id', center_id);
    formData.append('file', file);
    formData.append('fileName', fileName);

    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.upload_franchise_documents, formData);
  }

  GetAllAvailableFranchises(page_number: number, page_size: number): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.get_available_franchises, { page_number, page_size });
  }

  DoApprovOrReject(operation: number, center_ids: string[]): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.approve_reject_franchises, { operation, center_ids });
  }
}
