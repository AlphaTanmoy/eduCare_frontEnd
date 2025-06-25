import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StudentCertificateService {

  constructor(private http: HttpClient) { }

  issueCertificate(formData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student_certificate.issue_certificate, formData);
  }

  downloadExcelRelatedToCertificateIssue(info: any): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.generate_and_download_excel_to_generate_certificate, { info: info }, { observe: 'response', responseType: 'blob' });
  }

  downloadCertificate(student_id: string) {
    return this.http.get(GetBaseURL() + Endpoints.student_certificate.download_certificate + "/" + student_id, { responseType: 'blob' });
  }

  getEligibleStudentListForRaisingTicket() {
    return this.http.get(GetBaseURL() + Endpoints.student_certificate.get_eligible_student_list_for_raising_ticket);
  }

  raiseTicketForCertificateGeneration() {
    return this.http.get(GetBaseURL() + Endpoints.student_certificate.raise_ticket_for_certificate_generation);
  }

  getAvailableCertificateTicketList() {
    return this.http.get(GetBaseURL() + Endpoints.student_certificate.get_available_certificate_ticket_list);
  }
}
