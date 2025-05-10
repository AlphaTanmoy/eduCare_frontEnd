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
  currentSubCourses: string[] = [];
  moduleOptionsAll: Dropdown[] = [];
  courseName: string = '';
  theoryMarks: number | null = null;
  practicalMarks: number | null = null;
  duration: string = '';
  module: string = '';
  moduleDetails: ModuleDetail[] = [];

  error: string | null = null;
  theoryMarksError: string | null = null;
  practicalMarksError: string | null = null;

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
      this.parentCourseId = params['parentCourseId'] || '';

      if (!this.parentCourseId) {
        this.openDialog("Course", 'Parent course ID is required', ResponseTypeColor.ERROR, '/admin-panel/course-list');
        return;
      }
    });

    this.activeMatProgressBar();

    this.courseService.getAllSubCourses().subscribe({
      next: (response) => {
        this.currentSubCourses = response.data
          .filter((course: any) => course.course_name)
          .map((course: any) => course.course_name.toLowerCase());
      },
      error: () => {
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
          .filter((item: any) => item._id && item.enum_value)
          .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
          .map((item: any) => new Dropdown(item._id, this.formatEnumValue(item.enum_value)));
      },
      error: () => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Error fetching duration types', ResponseTypeColor.ERROR, null);
      }
    });

    this.enumsService.getEnumsByName('module_type').subscribe({
      next: (response) => {
        this.moduleOptionsAll = response.data
          .filter((item: any) => item._id && item.enum_value)
          .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
          .map((item: any) => new Dropdown(item._id, item.enum_value));

        this.moduleOptions = [...this.moduleOptionsAll];
        this.hideMatProgressBar();
      },
      error: () => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Error fetching module types', ResponseTypeColor.ERROR, null);
      }
    });
  }

  onModuleChange() {
    if (this.module && !isNaN(parseInt(this.module))) {
      this.moduleDetails = [];
      const moduleNumber = parseInt(this.module);
      for (let i = 0; i < moduleNumber; i++) {
        this.moduleDetails.push({ content: '' });
      }
    } else {
      this.moduleDetails = [];
    }
  }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.courseName = input.value.trim();

    if (this.currentSubCourses.includes(this.courseName.toLowerCase())) {
      this.error = "A sub-course with this name already exists";
    } else {
      this.error = null;
    }
  }

  onTheoryMarksInput() {
    if (this.theoryMarks !== null) {
      if (this.theoryMarks < 0 || this.theoryMarks > 100) {
        this.theoryMarksError = 'Theory marks must be between 0 and 100';
        this.practicalMarks = null;
      } else {
        this.theoryMarksError = null;
        this.practicalMarks = 100 - this.theoryMarks;
        this.practicalMarksError = null;
      }
    } else {
      this.theoryMarksError = 'Theory marks are required';
      this.practicalMarks = null;
      this.practicalMarksError = null;
    }
    this.cdr.detectChanges();
  }

  onPracticalMarksInput() {
    if (this.practicalMarks !== null) {
      if (this.practicalMarks < 0 || this.practicalMarks > 100) {
        this.practicalMarksError = 'Practical marks must be between 0 and 100';
        this.theoryMarks = null;
      } else {
        this.practicalMarksError = null;
        this.theoryMarks = 100 - this.practicalMarks;
        this.theoryMarksError = null;
      }
    } else {
      this.practicalMarksError = 'Practical marks are required';
      this.theoryMarks = null;
      this.theoryMarksError = null;
    }
    this.cdr.detectChanges();
  }

  handleDurationSelection(event: Dropdown | null): void {
    if (event && event.text) {
      this.duration = event.text;
      const totalDays = this.parseDurationToDays(this.duration);

      let allowedEnumValues: string[] = [];
      if (totalDays >= 1 && totalDays < 120) {
        allowedEnumValues = ['1'];
      } else if (totalDays >= 120 && totalDays < 300) {
        allowedEnumValues = ['1', '2'];
      } else if (totalDays >= 300 && totalDays < 730) {
        allowedEnumValues = ['1', '2', '3'];
      } else if (totalDays >= 730) {
        allowedEnumValues = ['1', '2', '3', '4'];
      }

      this.moduleOptions = this.moduleOptionsAll.filter(
        option => option.text !== undefined && allowedEnumValues.includes(option.text)
      );
    } else {
      this.duration = '';
      this.moduleOptions = [...this.moduleOptionsAll];
    }
  }

  handleModuleSelection(event: Dropdown | null): void {
    if (event && event.text) {
      this.module = event.text;
      this.onModuleChange();
    } else {
      this.module = '';
      this.moduleDetails = [];
    }
  }

  onSubmit() {
    if (!this.parentCourseId) {
      this.openDialog("Course", 'Parent course ID is required', ResponseTypeColor.ERROR, null);
      return;
    }

    if (!this.courseName || !this.duration || !this.module || this.moduleDetails.length === 0) {
      this.openDialog("Course", 'Please fill in all required fields', ResponseTypeColor.INFO, null);
      return;
    }

    if (this.theoryMarks === null || this.practicalMarks === null || this.theoryMarks + this.practicalMarks !== 100) {
      this.openDialog("Course", 'Theory and Practical marks must sum to 100', ResponseTypeColor.INFO, null);
      return;
    }

    const formattedModuleDetails = this.moduleDetails.map(detail =>
      detail.content.split(',').map(item => item.trim())
    );

    this.activeMatProgressBar();
    const obj = {
      parentCourseId: this.parentCourseId,
      course_name: this.courseName,
      theory_marks: this.theoryMarks,
      practical_marks: this.practicalMarks,
      duration: this.parseDurationToDays(this.duration), // Convert duration to number (total days)
      module: parseInt(this.module),
      module_details: formattedModuleDetails
    };
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
        this.openDialog("Course", error.error?.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }

  private formatEnumValue(enumValue: string): string {
    const days = Number(enumValue);
    if (isNaN(days) || days <= 0) return enumValue;

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    let result = '';
    if (months > 0) {
      result += `${months} Month${months > 1 ? 's' : ''}`;
    }
    if (remainingDays > 0) {
      if (result) result += ' ';
      result += `${remainingDays} Day${remainingDays > 1 ? 's' : ''}`;
    }

    return result || enumValue;
  }

  private parseDurationToDays(duration: string): number {
    const monthMatch = duration.match(/(\d+)\s*Month/);
    const dayMatch = duration.match(/(\d+)\s*Day/);

    const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;
    const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;

    return (months * 30) + days;
  }

  isFormInvalid(): boolean {
    return (
      !!this.error ||
      this.courseName.trim().length === 0 ||
      this.theoryMarks === null ||
      this.practicalMarks === null ||
      this.theoryMarks + this.practicalMarks !== 100 ||
      this.duration.length === 0 ||
      this.module.length === 0 ||
      this.moduleDetails.some(m => m.content.trim().length === 0)
    );
  }
}
