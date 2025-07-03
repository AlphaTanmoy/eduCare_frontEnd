import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

export interface ContactFormData {
  emailId: string;
  message: string;
  subject: string;
}

export interface FeedbackReportData {
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
    submitFeedbackReport: Endpoints.contact.feedback_report,
    getAllContacts: Endpoints.contact.get_contacts_list
  };

  constructor(private http: HttpClient) {}

  submitContactForm(formData: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      `${this.baseUrl}${this.endpoints.submitContact}`,
      formData
    );
  }

  submitFeedbackReport(feedbackReport: FeedbackReportData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      `${this.baseUrl}${this.endpoints.submitFeedbackReport}`,
      feedbackReport
    );
  }

  getAllContacts(
    offset: number = 0, 
    limit: number = 10, 
    search: string = '', 
    sortBy: string = 'createdAt', 
    sortOrder: string = 'desc'
  ): Observable<any> {
    let params: any = {
      offset: offset.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    };

    if (search) {
      params.search = search;
    }

    return this.http.get(`${this.baseUrl}${this.endpoints.getAllContacts}`, { params });
  }

  markAsRead(contactId: string, message: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}contact/mark-read`,
      { 
        id: contactId,
        message: message,
        is_read: true
      }
    ).pipe(
      map((response: any) => {
        // Handle the new response format where data is an array with one object
        if (response && Array.isArray(response.data)) {
          return response.data[0] || {};
        }
        return response;
      })
    );
  }
}
