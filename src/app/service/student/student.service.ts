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
    // Format the date to DD-MM-YYYY before sending
    if (Student.student_DOB) {
      const date = new Date(Student.student_DOB);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      Student.student_DOB = `${day}-${month}-${year}`;
    }
    
    // Fix the marital status field name to match the API
    if (Student.student_marital_status) {
      Student.student_maratial_status = Student.student_marital_status;
      delete Student.student_marital_status;
    }
    
    return this.http.post<any>(GetBaseURL() + Endpoints.student.create_student, Student);
  }
}
