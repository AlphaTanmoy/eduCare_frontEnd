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

  getAvailableCertificateTicketList(franchise_ids: string[]) {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.get_available_certificate_ticket_list, { franchise_ids });
  }

  acceptOrRejectTicket(_ticketid: string, status: string, remarks: string | null) {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.accept_reject_ticket, { _ticketid, status, remarks });
  }

  publishTicket(_ticketid: string) {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.publish_ticket, { _ticketid });
  }

  downloadZipOfAllStudentPhotoOfFullTicket(ticket_id: string): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.download_zip_of_all_student_photo_of_full_ticket, { ticket_id }, { observe: 'response', responseType: 'blob' });
  }

  downloadZipOfSingleStudentPhoto(student_registration_number: string | null): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.student_certificate.download_zip_of_single_student_photo, { student_registration_number }, { observe: 'response', responseType: 'blob' });
  }
}
