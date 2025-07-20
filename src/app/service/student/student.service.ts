import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { AuthService } from '../auth/Auth.Service';
import { StudentLoginResponse, StudentProfile, StudentProfileResponse } from '../../model/student.model';

export type { StudentLoginResponse, StudentProfile, StudentProfileResponse } from '../../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentProfile: StudentProfile | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
          this.authService.saveToken(response.token);
          this.studentProfile = this.decodeToken(response.token);
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  logout(): void {
    this.authService.logout();
    this.studentProfile = null;
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  fetchStudentProfileFromApi(): Observable<StudentProfile> {
    return this.http.get<any>(`${GetBaseURL()}student/profile`).pipe(
      tap(response => console.log('Raw API Response:', response)),
      map(response => {
        // Check if response has the expected structure
        if (!response || !response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('Invalid response format: missing or empty data array');
        }

        const firstItem = response.data[0];
        if (!firstItem.personal_info) {
          throw new Error('Invalid response format: missing personal_info');
        }

        const profile = firstItem.personal_info;
        
        // Map the response to the StudentProfile interface
        const mappedProfile: StudentProfile = {
          id: profile.id || '',
          name: profile.name || '',
          date_of_birth: profile.date_of_birth || '',
          registration_number: profile.registration_number || '',
          certification_number: profile.certification_number || '',
          father_name: profile.father_name || 'NOT_PROVIDED',
          mother_name: profile.mother_name || 'NOT_PROVIDED',
          spouse_name: profile.spouse_name || 'NOT_PROVIDED',
          address: profile.address || ''
        };

        // Cache the profile
        this.studentProfile = mappedProfile;
        
        return mappedProfile;
      }),
      catchError(error => {
        console.error('Error in fetchStudentProfileFromApi:', error);
        return of({
          id: '',
          name: 'Error loading profile',
          date_of_birth: '',
          registration_number: '',
          certification_number: '',
          father_name: 'ERROR',
          mother_name: 'ERROR',
          spouse_name: 'ERROR',
          address: 'Error loading profile data'
        });
      })
    );
  }

  private decodeToken(token: string): StudentProfile {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid token format');
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      return {
        id: payload.id || '',
        name: payload.name || '',
        date_of_birth: payload.date_of_birth || '',
        registration_number: payload.registration_number || '',
        certification_number: payload.certification_number || '',
        father_name: payload.father_name || '',
        mother_name: payload.mother_name || '',
        spouse_name: payload.spouse_name || '',
        address: payload.address || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        id: '',
        name: '',
        date_of_birth: '',
        registration_number: '',
        certification_number: '',
        father_name: '',
        mother_name: '',
        spouse_name: '',
        address: ''
      };
    }
  }

  CreateStudent(Student: any): Observable<any> {
    if (Student.student_DOB) {
      const date = new Date(Student.student_DOB);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      Student.student_DOB = `${day}-${month}-${year}`;
    }

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

  getStudentPhotoStream(student_guid: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.student.get_student_photo_stream + "/" + student_guid, { responseType: 'blob' });
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

  downloadRegistrationCard(studentId: string): Observable<Blob> {
    return this.http.get(GetBaseURL() + Endpoints.student.download_registration_card + "/" + studentId, { responseType: 'blob' });
  }

  getAllAvailablePassoutStudents(page_number: number, page_size: number): Observable<any> {
    console.log("HI");
    return this.http.post<any>(GetBaseURL() + Endpoints.student.get_all_passout_students, { page_number, page_size });
  }

  getStudentInfoById(studentId: string | null): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.student.get_student_info_by_id + "/" + studentId);
  }

  UpdateStudentNecesseryDetails(Student: any): Observable<any> {
    if (Student.student_DOB) {
      const date = new Date(Student.student_DOB);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      Student.student_DOB = `${day}-${month}-${year}`;
    }

    if (Student.student_marital_status) {
      Student.student_maratial_status = Student.student_marital_status;
      delete Student.student_marital_status;
    }

    return this.http.post<any>(GetBaseURL() + Endpoints.student.update_students_necessery_details, Student);
  }

  UpdateStudentFamilyDetails(Student: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.update_students_family_details, Student);
  }

  UpdateStudentAddressDetails(Student: any): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.student.update_students_address_details, Student);
  }
}
