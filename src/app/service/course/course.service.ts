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
  constructor(private http: HttpClient) { }

  fetchAllCourses(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.course.get_all_parent_categories);
  }

  addCourseCategory(courseName: string): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.course.add_parent_category, { course_name: courseName });
  }

  editCourseCategory(course_id: string, obj: any): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.course.edit_parent_category + "/" + course_id, obj);
  }

  deleteCourse(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${GetBaseURL()}${endpoint}/${id}`);
  }

  getModuleTypes(): Observable<EnumValue[]> {
    return this.http.get<EnumValue[]>(`${GetBaseURL()}${Endpoints.enums.get_enums_by_name}/module_type`);
  }

  getDurations(): Observable<EnumValue[]> {
    return this.http.get<EnumValue[]>(`${GetBaseURL()}${Endpoints.enums.get_enums_by_name}/duration_type`);
  }

  getCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${GetBaseURL()}${Endpoints.course.get_course}/${id}`);
  }

  getSubCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${GetBaseURL()}sub-category/byId/${id}`);
  }

  getAllParentCategories(): Observable<any> {
    return this.http.get(`${GetBaseURL()}${Endpoints.course.get_all_parent_categories}`);
  }

  addParentCategory(courseName: string): Observable<any> {
    return this.http.post(`${GetBaseURL()}${Endpoints.course.add_parent_category}`, { course_name: courseName });
  }

  getAllSubCourses(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.course.get_all_sub_categories);
  }

  editParentCategory(courseCode: string, courseName: string): Observable<any> {
    var obj = {
      courseCode,
      course_name: courseName
    }
    return this.http.put(`${GetBaseURL()}${Endpoints.course.edit_parent_category}`, obj);
  }

  editSubCategory(obj: any): Observable<any> {
    return this.http.put(`${GetBaseURL()}${Endpoints.course.edit_sub_category}`, obj);
  }

  deleteParentCategory(courseCode: string): Observable<any> {
    return this.http.delete(`${GetBaseURL()}${Endpoints.course.delete_parent_category}/${courseCode}`);
  }

  addSubCategory(obj: any): Observable<any> {
    return this.http.post(GetBaseURL() + Endpoints.course.add_sub_category, obj);
  }

  deleteSubCategory(courseCode: string): Observable<any> {
    return this.http.delete(`${GetBaseURL()}${Endpoints.course.delete_sub_category}/${courseCode}`);
  }
}
