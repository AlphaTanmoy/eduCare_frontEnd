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
    submitContact: Endpoints.contacts.contact_us,
    submitBugReport: Endpoints.contacts.bug_report,
    getAllContacts: Endpoints.contacts.get_contacts_list
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

  getAllContacts(options: {
    offset?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Observable<any> {
    const params: any = {
      offset: options.offset?.toString() || '0',
      limit: options.limit?.toString() || '10',
      ...(options.search && { search: options.search }),
      sortBy: options.sortBy || 'createdAt',
      sortOrder: options.sortOrder || 'desc'
    };

    return this.http.get(`${this.baseUrl}${this.endpoints.getAllContacts}`, { params });
  }
}
