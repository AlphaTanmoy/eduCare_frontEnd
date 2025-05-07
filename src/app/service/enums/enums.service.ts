import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {
  constructor(private http: HttpClient) { }

  /**
   * Fetch all enums with pagination support
   * @param limit Number of records per request
   * @param offsetToken Offset token for pagination
   * @returns Observable with paginated enums data
   */
  getAllEnums(offsetToken: string | null, limit: number): Observable<any> {
    const params: any = { limit: limit };
    if (offsetToken) {
      params.offsetToken = offsetToken; // Pass offsetToken only if it's not null
    }
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_all_enums, { params });
  }


  /**
   * Fetch enums based on name
   * @param fileId Enum name identifier
   * @returns Observable with the enum details
   */
  getEnumsByName(enumName: string): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_enums_by_name + "/" + enumName);
  }

  /**
   * Fetch available enum names
   * @returns Observable with enum names list
   */
  getEnumNames(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.enums.get_enum_names);
  }
}
