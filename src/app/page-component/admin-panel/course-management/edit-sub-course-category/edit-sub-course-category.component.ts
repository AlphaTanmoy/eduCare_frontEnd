import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../service/course/course.service';
import { EnumsService } from '../../../../service/enums/enums.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { ActiveInactiveStatus, Dropdown, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';

interface ModuleDetail {
  content: string;
}

@Component({
  selector: 'app-edit-sub-course-category',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSingleSelectSearchableDropdownComponent, MatProgressBarModule],
  templateUrl: './edit-sub-course-category.component.html',
  styleUrls: ['./edit-sub-course-category.component.css']
})
export class EditSubCourseCategoryComponent implements OnInit, OnDestroy {
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);
  ActiveInactiveStatus = ActiveInactiveStatus;

  currentSubCourses: string[] = [];
  oldCourseName: string = '';
  oldDataStatus: string = '';

  subCategory = {
    _id: '',
    courseName: '',
    courseCode: '',
    duration: new Dropdown(undefined, undefined),
    module: new Dropdown(undefined, undefined),
    data_status: '',
    moduleDetails: [] as ModuleDetail[]
  };

  error: string | null = null;
  durationOptions: Dropdown[] = [];
  moduleOptions: Dropdown[] = [];
  moduleOptionsAll: Dropdown[] = []; // Store all module options for filtering

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private enumsService: EnumsService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.route.queryParams.subscribe(async (params) => {
      const id = params['id'];
      if (!id) {
        this.openDialog("Course", 'No sub-category ID provided', ResponseTypeColor.ERROR, '/admin-panel/course-list');
        return;
      }

      this.activeMatProgressBar();
      await this.fetchAllSubCourses();
      await this.fetchEnums();
      await this.loadSubCategory(id);
    });
  }

  async fetchAllSubCourses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.courseService.getAllSubCourses().subscribe({
        next: (response) => {
          this.currentSubCourses = response.data
            .filter((course: any) => course.course_name)
            .map((course: any) => course.course_name.toLowerCase());
          resolve();
        },
        error: (error) => {
          this.hideMatProgressBar();
          this.openDialog("Course", 'Error fetching other sub courses details', ResponseTypeColor.ERROR, null);
          reject(error);
        }
      });
    });
  }

  async fetchEnums(): Promise<void> {
    const durationPromise = new Promise<void>((resolve, reject) => {
      this.enumsService.getEnumsByName('duration_type').subscribe({
        next: (response) => {
          this.durationOptions = response.data
            .filter((item: any) => item._id && item.enum_value)
            .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
            .map((item: any) => new Dropdown(item._id, this.formatEnumValue(item.enum_value)));
          resolve();
        },
        error: (error) => {
          this.hideMatProgressBar();
          this.openDialog("Course", "Failed to fetch duration types", ResponseTypeColor.ERROR, null);
          reject(error);
        }
      });
    });

    const modulePromise = new Promise<void>((resolve, reject) => {
      this.enumsService.getEnumsByName('module_type').subscribe({
        next: (response) => {
          this.moduleOptionsAll = response.data
            .filter((item: any) => item._id && item.enum_value)
            .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
            .map((item: any) => new Dropdown(item._id, item.enum_value));
          this.moduleOptions = [...this.moduleOptionsAll];
          resolve();
        },
        error: (error) => {
          this.hideMatProgressBar();
          this.openDialog("Course", "Failed to fetch module types", ResponseTypeColor.ERROR, null);
          reject(error);
        }
      });
    });

    await Promise.all([durationPromise, modulePromise]);
  }

  async loadSubCategory(id: string) {
    this.courseService.getSubCourseById(id).subscribe({
      next: async (response) => {
        const data = response.data;
        const durationText = this.formatEnumValue(data.duration.toString());
        this.subCategory = {
          _id: data._id,
          courseName: data.course_name,
          courseCode: data.course_code,
          duration: this.durationOptions.find((item: Dropdown) => item.text === durationText) || new Dropdown(undefined, undefined),
          module: this.moduleOptions.find((item: Dropdown) => item.text === data.module.toString()) || new Dropdown(undefined, undefined),
          data_status: data.data_status,
          moduleDetails: (data.module_details || []).map((arr: string[]) => ({
            content: arr.join(', ')
          }))
        };

        this.oldCourseName = this.subCategory.courseName;
        this.oldDataStatus = this.subCategory.data_status;
        this.handleDurationSelection(this.subCategory.duration); // Filter modules based on loaded duration
        this.hideMatProgressBar();
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Course", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  onCourseNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.subCategory.courseName = input.value.trim();

    if (this.subCategory.courseName.toLowerCase() === this.oldCourseName.toLowerCase()) {
      this.error = null;
      return;
    }

    if (this.currentSubCourses.includes(this.subCategory.courseName.toLowerCase())) {
      this.error = "A sub-course with this name already exists";
    } else {
      this.error = null;
    }
  }

  onStatusChange(isChecked: boolean) {
    this.subCategory.data_status = isChecked ? ActiveInactiveStatus.ACTIVE : ActiveInactiveStatus.INACTIVE;
  }

  handleDurationSelection(event: Dropdown | null): void {
    this.subCategory.duration = event || new Dropdown(undefined, undefined);
    if (event && event.text) {
      const totalDays = this.parseDurationToDays(event.text);
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

      // Reset module if it's no longer valid
      if (this.subCategory.module.text && !allowedEnumValues.includes(this.subCategory.module.text)) {
        this.subCategory.module = new Dropdown(undefined, undefined);
        this.subCategory.moduleDetails = [];
      }
    } else {
      this.moduleOptions = [...this.moduleOptionsAll];
      this.subCategory.module = new Dropdown(undefined, undefined);
      this.subCategory.moduleDetails = [];
    }
  }

  handleModuleSelection(event: Dropdown | null): void {
    this.subCategory.module = event || new Dropdown(undefined, undefined);
    if (event && event.text) {
      const moduleNumber = parseInt(event.text);
      const newModuleDetails: ModuleDetail[] = [];
      for (let i = 0; i < moduleNumber; i++) {
        newModuleDetails.push({
          content: this.subCategory.moduleDetails[i]?.content || ''
        });
      }
      this.subCategory.moduleDetails = newModuleDetails;
    } else {
      this.subCategory.moduleDetails = [];
    }
  }

  onSubmit() {
    if (!this.subCategory.courseName || !this.subCategory.duration.text || !this.subCategory.module.text) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.subCategory.moduleDetails.some(m => !m.content.trim())) {
      this.error = 'All module details must be filled';
      return;
    }

    this.activeMatProgressBar();
    const payload = {
      id: this.subCategory._id,
      course_name: this.subCategory.courseName,
      duration: this.parseDurationToDays(this.subCategory.duration.text), // Send formatted duration
      module: parseInt(this.subCategory.module.text),
      data_status: this.subCategory.data_status,
      module_details: this.subCategory.moduleDetails.map(detail =>
        detail.content.split(',').map(item => item.trim()).filter(Boolean)
      )
    };

    this.courseService.editSubCategory(payload).subscribe({
      next: () => {
        this.hideMatProgressBar();
        this.openDialog("Course", 'Sub-course category has been updated successfully', ResponseTypeColor.SUCCESS, '/admin-panel/course-list');
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Course", err.error?.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  navigateToCourseList() {
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
      if (navigateRoute) window.location.href = navigateRoute;
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
      this.subCategory.courseName.trim().length === 0 ||
      !this.subCategory.duration.text ||
      !this.subCategory.module.text ||
      this.subCategory.moduleDetails.some(m => m.content.trim().length === 0)
    );
  }
}
