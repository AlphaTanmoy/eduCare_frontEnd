import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

export interface StudentLoginResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  token: string;
}

export interface StudentProfile {
  // Define student profile properties here
  id: string;
  registration_number: string;
  // Add other student profile fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly TOKEN_KEY = 'student_auth_token';
  private studentProfile: any = null;

  constructor(private http: HttpClient) {
    // Load profile from token if available
    const token = this.getToken();
    if (token) {
      this.studentProfile = this.decodeToken(token);
    }
  }

  studentLogin(registrationNumber: string, studentDOB: string): Observable<StudentLoginResponse> {
    return this.http.post<StudentLoginResponse>(
      `${GetBaseURL()}student/login`, 
      { 
        registration_number: registrationNumber, 
        student_DOB: studentDOB 
      }
    ).pipe(
      tap((response: StudentLoginResponse) => {
        if (response.status === 200 && response.responseType === 'SUCCESS' && response.token) {
          this.saveToken(response.token);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  saveToken(token: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      this.studentProfile = this.decodeToken(token);
    }
  }

  getToken(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded: any = this.decodeToken(token);
      if (!decoded || !decoded.exp) return false;
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
    this.studentProfile = null;
  }

  getStudentProfile(): any {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    if (!this.studentProfile) {
      const token = this.getToken();
      if (token) {
        this.studentProfile = this.decodeToken(token);
      }
    }
    
    return this.studentProfile;
  }

  private decodeToken(token: string): any {
    try {
      // Simple JWT decode (without signature verification)
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

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

  UploadStudentDocument(formData: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.add_student_document, formData);
  }

  getAllAvailableStudents(page_number: number, page_size: number): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.get_all_students, { page_number, page_size });
  }

  getStudentsPhotoTenInALimit(student_guids: string[]): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.get_student_photo_by_batch_processing, student_guids);
  }

  getStudentsAadharCardPhotoStream(student_guid: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.student.get_student_aadhar_card_photo_stream + "/" + student_guid, { responseType: 'blob' });
  }

  deleteStudent(studentId: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.delete_student, { studentId: studentId });
  }



  getStudentCourseInfo(studentId: string | null): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.student.get_student_course_info + "/" + studentId);
  }

  updateStudentMarks(student_id: string | null, course_code: string | null, marks: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.update_student_marks, { marks, course_code, student_id });
  }
}
