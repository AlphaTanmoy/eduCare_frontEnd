import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

export interface ContactFormData {
  emailId: string;
  message: string;
  subject: string;
}

export interface BugReportData {
  emailId: string;
  message: string;
}

export interface ContactResponse {
  status: string;
  message: string;
  data: {
    ticketCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = GetBaseURL();
  private endpoints = {
    submitContact: Endpoints.contact.contact_us,
    submitBugReport: Endpoints.contact.bug_report,
    getAllContacts: Endpoints.contact.get_contacts_list
  };

  constructor(private http: HttpClient) {}

  submitContactForm(formData: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      `${this.baseUrl}${this.endpoints.submitContact}`,
      formData
    );
  }

  submitBugReport(bugReport: BugReportData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      `${this.baseUrl}${this.endpoints.submitBugReport}`,
      bugReport
    );
  }

  getAllContacts(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.endpoints.getAllContacts}`);
  }
}
