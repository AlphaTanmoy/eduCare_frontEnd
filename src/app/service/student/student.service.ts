import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) { }

  CreateStudent(Student: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.create_student, { data: Student });
  }
}
