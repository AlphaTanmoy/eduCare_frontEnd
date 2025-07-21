import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

export interface EPDF {
  id?: string;
  name: string;
  link: string;
  course_codes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EpdfService {
  constructor(private http: HttpClient) {}

  createEPDF(epdfData: Omit<EPDF, 'id' | 'createdAt' | 'updatedAt'>): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.epdf.create_epdf, epdfData);
  }


  getAllEPDFs(): Observable<EPDF[]> {
    return this.http.get<EPDF[]>(GetBaseURL() + Endpoints.epdf.get_epdf);
  }

  getEPDFForStudent(registrationNumber: string): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.epdf.get_epdf_for_student, { 
      registrationNumber: registrationNumber
    });
  }

  deleteEPDF(id: string): Observable<any> {
    return this.http.request('delete', GetBaseURL() + Endpoints.epdf.delete_epdf, {
      body: { id }
    });
  }
}
