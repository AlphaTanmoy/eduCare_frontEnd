import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { GetBaseURL, Endpoints } from '../../../endpoints/endpoints';
import { AuthService } from '../../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

interface SubCategory {
  id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  duration: string;
  module: string;
}


interface ParentCategory {
  id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  subCategories: SubCategory[];
}

interface ApiResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: ParentCategory[];
  pagination: {
    limit: string;
    totalRecords: number;
    offsetToken: string;
  };
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: ParentCategory[] = [];
  loading: boolean = true;
  error: string | null = null;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchCourses();
    this.bootstrapElements = loadBootstrap();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  fetchCourses() {
    this.loading = true;
    this.http.get<ApiResponse>(
      GetBaseURL() + Endpoints.course.get_all_parent_categories,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (response) => {
        this.courses = response.data;
        this.loading = false;
        console.log('Fetched course data:', response.data);
      },
      error: (error) => {
        this.error = 'Failed to fetch courses';
        this.loading = false;
        console.error('Error fetching courses:', error);
      }

    });
  }

  addParentCategory() {
    this.router.navigate(['/admin-panel/add/primary-course']);
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  addSubCategory(parentCourse: ParentCategory) {
    this.router.navigate(['/admin-panel/add/sub-course'], {
      queryParams: { parentCourseId: parentCourse.id }
    });
  }

  editCategory(id: string, isParent: boolean) {
    if (!isParent) {
      this.router.navigate(['/admin-panel/edit-sub-course'], {
        queryParams: { id }
      });
    }
  }

  deleteCategory(id: string, isParent: boolean) {
    console.log('Delete called with id:', id, 'isParent:', isParent);

    if (confirm('Are you sure you want to delete this category?')) {
      const endpoint = isParent
        ? Endpoints.course.delete_parent_category
        : Endpoints.course.delete_sub_category;

      this.http.delete(
        `${GetBaseURL()}${endpoint}/${id}`,
        { headers: this.getHeaders() }
      ).subscribe({
        next: () => {
          this.fetchCourses();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      });
    }
  }



  viewCourse(courseCode: string) {
    this.router.navigate(['/admin-panel/view-course', courseCode]);
  }
}
