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
    return this.http.post<any>(GetBaseURL() + Endpoints.student.issue_certificate, { student_id });
  }
}
