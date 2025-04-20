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

  getCourseById(courseCode: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(
      `${GetBaseURL()}${Endpoints.course.get_course}/${courseCode}`,
      { headers: this.getHeaders() }
    );
  }

  getAllParentCategories(): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.course.get_all_parent_categories);
  }

  addParentCategory(courseName: string): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.course.add_parent_category, {
      course_name: courseName
    });
  }

  addSubCategory(
    parentCourseId: string,
    courseName: string,
    duration: string,
    module: string,
    moduleDetails: string[][]
  ): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.course.add_sub_category, {
      parentCourseId,
      course_name: courseName,
      duration,
      module,
      module_details: moduleDetails
    });
  }

  editParentCategory(courseCode: string, courseName: string): Observable<any> {
    return this.http.put(GetBaseURL() + Endpoints.course.edit_parent_category, {
      courseCode,
      course_name: courseName
    });
  }

  editSubCategory(
    courseCode: string,
    courseName: string,
    duration: string,
    module: string,
    moduleDetails: string[][]
  ): Observable<any> {
    return this.http.put(GetBaseURL() + Endpoints.course.edit_sub_category, {
      courseCode,
      course_name: courseName,
      duration,
      module,
      module_details: moduleDetails
    });
  }

  deleteParentCategory(courseCode: string): Observable<any> {
    return this.http.delete(GetBaseURL() + Endpoints.course.delete_parent_category + `/${courseCode}`);
  }

  deleteSubCategory(courseCode: string): Observable<any> {
    return this.http.delete(GetBaseURL() + Endpoints.course.delete_sub_category + `/${courseCode}`);
  }
} 