import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

export interface StudentVerificationRequest {
  registrationNumber: string;
}

export interface FranchiseVerificationRequest {
  franchiseRegistrationNumber: string;
}

export interface CertificateVerificationRequest {
  certificateNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class VerifyService {
  private baseUrl = GetBaseURL();

  constructor(private http: HttpClient) { }

  verifyStudent(registrationNumber: string): Observable<any> {
    const payload: StudentVerificationRequest = { registrationNumber };
    return this.http.post(`${this.baseUrl}${Endpoints.verify.student}`, payload);
  }

  verifyFranchise(franchiseRegistrationNumber: string): Observable<any> {
    const payload: FranchiseVerificationRequest = { franchiseRegistrationNumber };
    return this.http.post(`${this.baseUrl}${Endpoints.verify.franchise}`, payload);
  }

  verifyCertificate(certificateNumber: string): Observable<any> {
    const payload: CertificateVerificationRequest = { certificateNumber };
    return this.http.post(`${this.baseUrl}${Endpoints.verify.certificate}`, payload);
  }
}