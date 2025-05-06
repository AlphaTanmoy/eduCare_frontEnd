import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumsService } from '../../../../service/enums/enums.service';
import { CourseService } from '../../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Dropdown, ResponseTypeColor } from '../../../../constants/commonConstants';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';

interface ModuleDetail {
  content: string;
}

@Component({
  selector: 'app-add-sub-course-category',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressBarModule, CustomSingleSelectSearchableDropdownComponent],
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

  error: any;

  parentCourseId: string = '';
  durationOptions: Dropdown[] = [];
  moduleOptions: Dropdown[] = [];

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
          .map((course: any) => course.course_name.toLowerCase());
      },
      error: (error) => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Error fetching other sub courses details', ResponseTypeColor.ERROR, null);
      }
    });

    this.fetchEnums();
  }

  fetchEnums() {
    this.enumsService.getEnumsByName('duration_type').subscribe({
      next: (response) => {
        this.durationOptions = response.data
          .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
          .map((item: any) => new Dropdown(item._id, item.enum_value));
      },
      error: (error) => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Error fetching duration types', ResponseTypeColor.ERROR, null);
      }
    });

    this.enumsService.getEnumsByName('module_type').subscribe({
      next: (response) => {
        this.moduleOptions = response.data
          .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
          .map((item: any) => new Dropdown(item._id, item.enum_value));

        this.hideMatProgressBar();
      },
      error: (error) => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Error fetching module types', ResponseTypeColor.ERROR, null);
      }
    });
  }

  onModuleChange() {
    if (this.module) {
      this.moduleDetails = [];

      const moduleNumber = parseInt(this.module);

      for (let i = 0; i < moduleNumber; i++) {
        this.moduleDetails.push({ content: '' });
      }
    }
  }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.courseName = input.value;
    this.courseName = this.courseName.trim();

    if (this.currentSubCourses.includes(this.courseName.toLowerCase())) {
      this.error = "A sub-course with this name already exists";
    } else {
      this.error = null;
    }
  }

  handleDurationSelection(event: any): void {
    this.duration = event.text;
  }

  handleModuleSelection(event: any): void {
    this.module = event.text;
    console.log(this.module)

    this.onModuleChange();
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

    this.error = null;

    // Format module details as array of arrays
    const formattedModuleDetails = this.moduleDetails.map(detail => {
      // Split the content by comma and trim each item
      return detail.content.split(',').map(item => item.trim());
    });

    this.activeMatProgressBar();
    var obj = {
      parentCourseId: this.parentCourseId,
      course_name: this.courseName,
      duration: this.duration,
      module: parseInt(this.module),
      module_details: formattedModuleDetails
    }
    console.log(obj)
    this.courseService.addSubCategory(obj).subscribe({
      next: (response) => {
        this.hideMatProgressBar();
        if (response.status === 200) {
          this.openDialog("Course", 'Sub-course category has been added successfully', ResponseTypeColor.SUCCESS, '/admin-panel/course-list');
        } else {
          this.openDialog("Course", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (error) => {
        this.hideMatProgressBar();
        this.openDialog("Course", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin-panel/course-list']);
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: any): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) window.location.href = navigateRoute;
    });
  }
}



