import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StudentCertificateService {

  constructor(private http: HttpClient) { }

  issueCertificate(student_id: string | null): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student_certificate.issue_certificate, { student_id });
  }

  downloadExcelRelatedToCertificateIssue(info: any): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.generate_and_download_excel_to_generate_certificate, { info: info }, { observe: 'response', responseType: 'blob' });
  }
}
