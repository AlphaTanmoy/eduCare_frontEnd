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

  getAllCentersBasicInfo(): Observable<{
    status: number;
    responseType: string;
    apiPath: string;
    message: string;
    data: Array<{
      _id: string;
      center_name: string;
    }>;
  }> {
    return this.http.get<{
      status: number;
      responseType: string;
      apiPath: string;
      message: string;
      data: Array<{
        _id: string;
        center_name: string;
      }>;
    }>(GetBaseURL() + Endpoints.franchise.get_all_centers_basic_info);
  }

  getAllAvailableSubCourseByFranchise(franchiseId: string | null): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.franchise.get_all_subcourse_by_franchise + "/" + franchiseId);
  }

  GetAllAvailableFranchisesAndItsCourseDetails(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.franchise.get_available_franchises_and_its_course_details);
  }

  GetAllAvailableFranchisesByOffset(page_number: number, page_size: number): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.get_available_franchises_by_offset, { page_number, page_size });
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

  GetCenterDocumeentsInfo(center_id: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.franchise.get_center_documents_info + "/" + center_id);
  }

  UpdateCenterHead(center_head_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.update_center_head_details, { data: center_head_details });
  }

  UpdateCenter(center_details: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.update_center_details, { data: center_details });
  }

  UpdateFranchiseDocument(formData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.franchise.update_franchise_documents, formData);
  }

  GetFranchiseIdByUserId(userId: string | null): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.franchise.get_franchise_id_from_user_id + "/" + userId);
  }

  GetFranchiseWalletRechargeQrCode(): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.franchise.get_franchise_wallet_recharge_qr_code, { responseType: 'blob' });
  }
}
