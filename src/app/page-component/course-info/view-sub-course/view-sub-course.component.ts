import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faBook, faClock, faListOl, faCheckCircle, faTimesCircle, faTasks, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

interface SubCategory {
  courseCode: string;
  courseName: string;
  dataStatus: string;
  duration: number;
  module: number;
  module_details: string[][];
  practical_marks?: number;
  theory_marks?: number;
}

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  subCategories: SubCategory[];
}

@Component({
  selector: 'app-view-sub-course',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './view-sub-course.component.html',
  styleUrl: './view-sub-course.component.css'
})
export class ViewSubCourseComponent implements OnInit, OnDestroy {
  courseCode: string = '';
  course: Course | null = null;
  loading: boolean = true;
  error: string = '';

  // Font Awesome icons
  faArrowLeft = faArrowLeft;
  faBook = faBook;
  faClock = faClock;
  faListOl = faListOl;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faTasks = faTasks;
  faGraduationCap = faGraduationCap;

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

  // Method to format duration (in days) into Months and Days
  formatDuration(days: number): string {
    if (days <= 0) return '0 Days';

    const months = Math.floor(days / 30); // Calculate whole months
    const remainingDays = days % 30; // Calculate remaining days

    let result = '';
    if (months > 0) {
      result += `${months} Month${months > 1 ? 's' : ''}`;
    }
    if (remainingDays > 0) {
      if (months > 0) result += ' '; // Add space between months and days
      result += `${remainingDays} Day${remainingDays > 1 ? 's' : ''}`;
    }

    return result || '0 Days'; // Fallback in case result is empty
  }

  formatEnumValue(value: string): string {
    if (!value) return 'Unknown';
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  backToCourseList() {
    this.router.navigate(['/course-offered']);
  }

  hasSubCategories(): boolean {
    return !!this.course && !!this.course.subCategories && this.course.subCategories.length > 0;
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}

