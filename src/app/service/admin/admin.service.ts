import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  UploadDashboardEmailID(EmailID: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_email_id, { emailID: EmailID });
  }

  UploadDashboardPhone1(Phone1: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_phone1, { phone1: Phone1 });
  }

  UploadDashboardPhone2(Phone2: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_phone2, { phone2: Phone2 });
  }

  UploadDashboardFacebook(Facebook: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_facebook, { facebook: Facebook });
  }

  UploadDashboardYoutube(Youtube: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_youtube, { youtube: Youtube });
  }

  UploadDashboardWhatsapp(Whatsapp: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.update_whatsapp, { whatsapp: Whatsapp });
  }

  GetAllAdmins(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.admin.get_all_admin);
  }

  CreateAdmin(Admin: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.create_admin, { data: Admin });
  }

  EditAdmin(Admin: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.edit_admin, { data: Admin });
  }

  DeleteAdmin(id: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.admin.delete_admin, { id: id });
  }
}
