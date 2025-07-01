// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StudentService } from '../../../service/student/student.service';
import { finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  profile: any = {};
  isLoading = false;
  studentPhoto: string = 'image//default_student_photo.jpg';
  hasImageError = false;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.fetchStudentProfile();
  }

  fetchStudentProfile(): void {
    this.isLoading = true;
    this.studentService.fetchStudentProfileFromApi()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          if (profile?.id) {
            this.loadStudentPhoto(profile.id);
          }
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
        }
      });
  }

  loadStudentPhoto(studentId: string): void {
    if (this.hasImageError) {
      return; // Don't try to load if we've already had an error
    }
    
    this.studentService.getStudentsPhotoTenInALimit([studentId])
      .subscribe({
        next: (response) => {
          if (response?.status === 200 && response.data?.length > 0) {
            const photoData = response.data[0]?.student_photo;
            if (photoData) {
              this.studentPhoto = 'data:image/jpeg;base64,' + photoData;
            }
          }
        },
        error: (error) => {
          console.error('Error loading student photo:', error);
          this.hasImageError = true;
        }
      });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    this.hasImageError = true;
    target.src = 'image/default_student_photo.jpg';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}