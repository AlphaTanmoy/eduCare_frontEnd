import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }

  getAllAvailableCourseCategories(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.common.get_all_course_categories);
  }

  getAllAvailableCenterTypes(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.common.get_all_center_types);
  }

  getAllAvailableUsers(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.common.get_all_available_user);
  }

  getAllAvailableSubCourseByFranchise(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.common.get_all_subcourse_by_franchise);
  }
}
