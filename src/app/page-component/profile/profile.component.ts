import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

// Define interfaces for our data structures
interface StudentProfile {
  student_id?: string;
  student_name?: string;
  registration_number?: string;
  student_email?: string;
  student_phone_no?: string;
  date_of_birth?: string;
  address?: string;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

enum ResponseTypeColor {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

enum IndexedDBItemKey {
  STUDENT_PROFILE_PHOTO = 'student_profile_photo_'
}

import { Observable, of } from 'rxjs';

// Mock services - Replace these with your actual services
class StudentService {
  getStudentProfile(id: string): Observable<ApiResponse<StudentProfile>> {
    // Mock implementation - replace with actual service call
    return of({
      data: {
        student_id: id,
        student_name: 'John Doe',
        registration_number: 'REG123',
        student_email: 'john.doe@example.com',
        student_phone_no: '1234567890',
        date_of_birth: '2000-01-01',
        address: '123 Main St, City, Country'
      },
      status: 200,
      message: 'Success'
    });
  }

  getStudentsPhotoTenInALimit(ids: string[]): Observable<ApiResponse<string[]>> {
    // Mock implementation - replace with actual service call
    return of({
      data: ['mock-base64-encoded-image-data'],
      status: 200,
      message: 'Success'
    });
  }
}

class IndexedDbService {
  async getItem(key: string) {
    // Mock implementation
    return null;
  }
  
  async addItem(key: string, value: any) {
    // Mock implementation
  }
}

class AuthService {
  async getUserId() {
    // Mock implementation
    return 'mock-user-id';
  }
}

// Replace with actual component when available
@Component({
  selector: 'app-custom-alert',
  template: '<div></div>',
  standalone: true
})
class CustomAlertComponent {
  // Mock implementation
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private studentService = new StudentService();
  private indexedDbService = new IndexedDbService();
  private authService = new AuthService();
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  student: StudentProfile = {};
  isLoading = true;
  studentPhoto: string = 'assets/images/default_student_photo.jpg';
  hasImageError = false;

  constructor() {}

  async ngOnInit() {
    await this.loadStudentProfile();
  }

  private async loadStudentProfile() {
    try {
      // Get student ID from auth service
      const userId = await this.authService.getUserId();
      if (!userId) {
        this.openDialog("Error", "User not authenticated", ResponseTypeColor.ERROR, false);
        return;
      }

      // Get student profile with proper typing
      const res = await firstValueFrom(
        this.studentService.getStudentProfile(userId)
      ) as ApiResponse<StudentProfile>;
      
      if (res.status !== 200) {
        this.openDialog("Error", res.message || "Failed to load profile", ResponseTypeColor.ERROR, false);
        return;
      }

      this.student = res.data;
      
      // Load student photo
      await this.loadStudentPhoto(userId);
    } catch (error) {
      console.error('Error loading student profile:', error);
      this.openDialog("Error", "Failed to load profile", ResponseTypeColor.ERROR, false);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadStudentPhoto(studentId: string) {
    if (this.hasImageError) return;

    try {
      // Check cache first
      const cachedImage = await this.indexedDbService.getItem(
        IndexedDBItemKey.STUDENT_PROFILE_PHOTO + studentId
      ) as { value: string } | null;

      if (cachedImage?.value) {
        this.studentPhoto = cachedImage.value;
        return;
      }

      // If not in cache, fetch from API with type assertion
      const photoResponse = await firstValueFrom(
        this.studentService.getStudentsPhotoTenInALimit([studentId])
      ) as ApiResponse<string[]>;

      if (photoResponse.status === 200 && photoResponse.data?.length > 0) {
        const photoData = photoResponse.data[0];
        if (photoData) {
          this.studentPhoto = `data:image/jpg;base64,${photoData}`;
          // Cache the image
          await this.indexedDbService.addItem(
            IndexedDBItemKey.STUDENT_PROFILE_PHOTO + studentId,
            this.studentPhoto
          );
        }
      }
    } catch (error) {
      console.error('Error loading student photo:', error);
      this.hasImageError = true;
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    this.hasImageError = true;
    target.src = 'assets/images/default_student_photo.jpg';
  }

  private openDialog(title: string, message: string, color: ResponseTypeColor, isSuccess: boolean) {
    this.dialog.open(CustomAlertComponent, {
      width: '400px',
      data: { title, message, color, isSuccess }
    });
  }
}
