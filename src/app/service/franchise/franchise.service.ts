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

  AddCenter(center_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.add_center_details, { data: center_details });
  }

  UploadFranchiseDocument(formData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.upload_franchise_documents, formData);
  }

  GetAllAvailableFranchises(page_number: number, page_size: number): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.get_available_franchises, { page_number, page_size });
  }

  DoApproveOrReject(operation: number, center_ids: string[]): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.approve_reject_franchises, { operation, center_ids });
  }

  GetCenterHeadDetails(center_head_id: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.get_center_head_details, { center_head_id: center_head_id });
  }

  GetFileStreamByFolderAndFilename(center_id: string, filename: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.franchise.get_center_documents + "/" + center_id + "/" + filename, { responseType: 'blob' });
  }

  GetCenterDetails(center_id: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.franchise.get_center_details + "/" + center_id);
  }

  UpdateCenterHead(center_head_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.update_center_head_details, { data: center_head_details });
  }

  UpdateCenter(center_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.update_center_details, { data: center_details });
  }
}
