import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetBaseURL, Endpoints } from '../../../../endpoints/endpoints';
import { AuthService } from '../../../../service/auth/Auth.Service';

@Component({
  selector: 'app-add-primary-course-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-primary-course-category.component.html',
  styleUrl: './add-primary-course-category.component.css'
})
export class AddPrimaryCourseCategoryComponent implements OnInit {
  courseName: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  onSubmit() {
    if (!this.courseName.trim()) {
      this.error = 'Course name is required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.http.post(
      GetBaseURL() + Endpoints.course.add_parent_category,
      { course_name: this.courseName },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin-panel/course-list']);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to add course category';
        console.error('Error adding course category:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin-panel/course-list']);
  }
}
