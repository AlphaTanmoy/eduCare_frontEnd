import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})

export class EnumsService {
  constructor(private http: HttpClient) { }

  getAllEnums(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_all_enums);
  }

  getEnumsByName(fileId: string): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_enums_by_name);
  }

  getEnumNames(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_enum_names);
  }
}
