import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { AuthService } from '../auth/Auth.Service';

interface CourseResponse {
  data: any;
  message: string;
  status: number;
}

interface EnumValue {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getModuleTypes(): Observable<EnumValue[]> {
    return this.http.get<EnumValue[]>(
      `${GetBaseURL()}${Endpoints.enums.get_enums_by_name}/module_type`,
      { headers: this.getHeaders() }
    );
  }

  getDurations(): Observable<EnumValue[]> {
    return this.http.get<EnumValue[]>(
      `${GetBaseURL()}${Endpoints.enums.get_enums_by_name}/duration_type`,
      { headers: this.getHeaders() }
    );
  }

  getCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(
      `${GetBaseURL()}${Endpoints.course.get_course}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getSubCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(
      `${GetBaseURL()}sub-category/byId/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getAllParentCategories(): Observable<any> {
    return this.http.get(
      `${GetBaseURL()}${Endpoints.course.get_all_parent_categories}`,
      { headers: this.getHeaders() }
    );
  }

  addParentCategory(courseName: string): Observable<any> {
    return this.http.post(
      `${GetBaseURL()}${Endpoints.course.add_parent_category}`,
      { course_name: courseName },
      { headers: this.getHeaders() }
    );
  }

  addSubCategory(
    parentCourseId: string,
    courseName: string,
    duration: string,
    module: string,
    moduleDetails: string[][]
  ): Observable<any> {
    return this.http.post(
      `${GetBaseURL()}${Endpoints.course.add_sub_category}`,
      {
        parentCourseId,
        course_name: courseName,
        duration,
        module,
        module_details: moduleDetails
      },
      { headers: this.getHeaders() }
    );
  }

  editParentCategory(courseCode: string, courseName: string): Observable<any> {
    return this.http.put(
      `${GetBaseURL()}${Endpoints.course.edit_parent_category}`,
      {
        courseCode,
        course_name: courseName
      },
      { headers: this.getHeaders() }
    );
  }

  editSubCategory(requestBody: {
    id: string;
    course_code: string;
    duration: string;
    module: string;
    module_details: string[][];
  }): Observable<any> {
    return this.http.put(
      `${GetBaseURL()}${Endpoints.course.edit_sub_category}`,
      requestBody,
      { headers: this.getHeaders() }
    );
  }

  deleteParentCategory(courseCode: string): Observable<any> {
    return this.http.delete(
      `${GetBaseURL()}${Endpoints.course.delete_parent_category}/${courseCode}`,
      { headers: this.getHeaders() }
    );
  }

  deleteSubCategory(courseCode: string): Observable<any> {
    return this.http.delete(
      `${GetBaseURL()}${Endpoints.course.delete_sub_category}/${courseCode}`,
      { headers: this.getHeaders() }
    );
  }
}
