import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

interface SubCategory {
  courseCode: string;
  courseName: string;
  dataStatus: string;
  duration: string;
  module: string;
  moduleDetails: string[][]; // New field added
}


interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  subCategories: SubCategory[];
}

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {
  courseCode: string = '';
  course: Course | null = null;
  loading: boolean = true;
  error: string = '';

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.params.subscribe(params => {
      this.courseCode = params['courseCode'];
      if (!this.courseCode) {
        this.error = 'Course code is required';
        return;
      }
      this.fetchCourseDetails();
    });
  }

  private fetchCourseDetails() {
    this.loading = true;
    this.courseService.getCourseById(this.courseCode).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.course = response.data[0];
        } else {
          this.error = 'Course not found';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load course details';
        this.loading = false;
        console.error('Error fetching course details:', error);
      }
    });
  }

  formatEnumValue(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  backToCourseList() {
    this.router.navigate(['/admin-panel/course-list']);
  }

  hasSubCategories(): boolean {
    return !!this.course && !!this.course.subCategories && this.course.subCategories.length > 0;
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

}
