import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetBaseURL, Endpoints } from '../../../../endpoints/endpoints';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { EnumsService } from '../../../../service/enums/enums.service';
import { CourseService } from '../../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResponseTypeColor } from '../../../../constants/commonConstants';

interface EnumOption {
  value: string;
  label: string;
}

interface ModuleDetail {
  content: string;
}

@Component({
  selector: 'app-add-sub-course-category',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './add-sub-course-category.component.html',
  styleUrl: './add-sub-course-category.component.css'
})
export class AddSubCourseCategoryComponent implements OnInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  currentSubCourses: any;

  courseName: string = '';
  duration: string = '';
  module: string = '';
  moduleDetails: ModuleDetail[] = [];
  loading: boolean = false;
  error: any;
  success: string = '';
  parentCourseId: string = '';
  durationOptions: EnumOption[] = [];
  moduleOptions: EnumOption[] = [];

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private enumsService: EnumsService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    
    this.route.queryParams.subscribe(params => {
      this.parentCourseId = params['parentCourseId'];

      if (!this.parentCourseId) {
        this.openDialog("Course", 'Parent course ID is required', ResponseTypeColor.ERROR, '/admin-panel/course-list');
        return;
      }
    });

    this.activeMatProgressBar();

    this.courseService.getAllSubCourses().subscribe({
      next: (response) => {
        this.currentSubCourses = response.data;
        this.currentSubCourses = this.currentSubCourses
          .filter((course: any) => course.course_name)
          .map((course: any) => course.course_name);
      },
      error: (error) => {
        console.error('Error fetching duration types:', error);
        this.error = 'Failed to load duration types';
        this.hideMatProgressBar();
      }
    });

    this.fetchEnums();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  fetchEnums() {
    this.enumsService.getEnumsByName('duration_type').subscribe({
      next: (response) => {
        this.durationOptions = response.data.map((item: any) => ({
          value: item.enum_value,
          label: this.formatEnumLabel(item.enum_value)
        }));
      },
      error: (error) => {
        console.error('Error fetching duration types:', error);
        this.error = 'Failed to load duration types';
        this.hideMatProgressBar();
      }
    });

    this.enumsService.getEnumsByName('module_type').subscribe({
      next: (response) => {
        this.moduleOptions = response.data.map((item: any) => ({
          value: item.enum_value,
          label: this.formatEnumLabel(item.enum_value)
        }));

        this.hideMatProgressBar();
      },
      error: (error) => {
        console.error('Error fetching module types:', error);
        this.error = 'Failed to load module types';
        this.hideMatProgressBar();
      }
    });
  }

  formatEnumLabel(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onModuleChange() {
    if (this.module) {
      // Reset module details
      this.moduleDetails = [];

      // Get the number from the module type (e.g., "MODULE_TYPE_2" -> 2)
      const moduleNumber = parseInt(this.module.split('_').pop() || '1');

      // Generate the required number of module details
      for (let i = 0; i < moduleNumber; i++) {
        this.moduleDetails.push({ content: '' });
      }
    }
  }

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.courseName = input.value;
    this.courseName = this.courseName.trim();

    if (this.currentSubCourses.includes(this.courseName)) {
      this.error = "A sub-course with this name already exists";
    } else {
      this.error = null;
    }
  }

  onSubmit() {
    if (!this.parentCourseId) {
      this.error = 'Parent course ID is required';
      return;
    }

    if (!this.courseName || !this.duration || !this.module || this.moduleDetails.length === 0) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    // Format module details as array of arrays
    const formattedModuleDetails = this.moduleDetails.map(detail => {
      // Split the content by comma and trim each item
      return detail.content.split(',').map(item => item.trim());
    });

    this.http.post(
      GetBaseURL() + Endpoints.course.add_sub_category,
      {
        parentCourseId: this.parentCourseId,
        course_name: this.courseName,
        duration: this.duration,
        module: this.module,
        module_details: formattedModuleDetails
      },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Sub-course category added successfully';
        setTimeout(() => {
          this.router.navigate(['/admin-panel/course-list']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to add sub-course category';
        console.error('Error adding sub-course category:', error);
      }
    });
  }

  onDone() {
    this.router.navigate(['/admin-panel/course-list']);
  }

  cancel() {
    this.router.navigate(['/admin-panel/course-list']);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      window.location.href = navigateRoute;
    });
  }
}



