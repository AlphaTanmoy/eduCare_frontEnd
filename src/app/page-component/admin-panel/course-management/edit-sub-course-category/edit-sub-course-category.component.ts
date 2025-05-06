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

interface EnumOption {
  value: string;
  label: string;
}

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

  currentSubCourses: any;

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
  moduleOptions: Dropdown[] = [];
  durationOptions: Dropdown[] = [];
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private enumsService: EnumsService,
    private cdr: ChangeDetectorRef
  ) { }

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
    const fetchAllSubCoursesPromise = new Promise<void>((resolve, reject) => {
      this.courseService.getAllSubCourses().subscribe({
        next: (response) => {
          this.currentSubCourses = response.data;
          this.currentSubCourses = this.currentSubCourses
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

    await fetchAllSubCoursesPromise;
  }

  async fetchEnums(): Promise<void> {
    const durationPromise = new Promise<void>((resolve, reject) => {
      this.enumsService.getEnumsByName('duration_type').subscribe({
        next: (response) => {
          this.durationOptions = response.data
            .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
            .map((item: any) => new Dropdown(item._id, item.enum_value));
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
          this.moduleOptions = response.data
            .sort((a: any, b: any) => Number(a.enum_value) - Number(b.enum_value))
            .map((item: any) => new Dropdown(item._id, item.enum_value));
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
        console.log(data)

        this.subCategory = {
          _id: data._id,
          courseName: data.course_name,
          courseCode: data.course_code,
          duration: this.durationOptions.find((item: Dropdown) => item.text === data.duration.toString()) || new Dropdown(undefined, undefined),
          module: this.moduleOptions.find((item: Dropdown) => item.text === data.module.toString()) || new Dropdown(undefined, undefined),
          data_status: data.data_status,
          moduleDetails: (data.module_details || []).map((arr: string[]) => ({
            content: arr.join(', ')
          }))
        };

        this.oldCourseName = this.subCategory.courseName;
        this.oldDataStatus = this.subCategory.data_status
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
    console.log(input.value)
    this.subCategory.courseName = input.value;
    this.subCategory.courseName = this.subCategory.courseName.trim();

    if (this.subCategory.courseName === this.oldCourseName) {
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

  onModuleChange(id: string) {
    this.subCategory.module = this.moduleOptions.find((item: Dropdown) => item.id === id) || new Dropdown(undefined, undefined);

    if (!this.subCategory.module) {
      this.subCategory.moduleDetails = [];
      return;
    }

    let moduleNumber = 0;
    if (this.subCategory.module.text) {
      moduleNumber = parseInt(this.subCategory.module.text);
    }

    const newModuleDetails = [];
    for (let i = 0; i < moduleNumber; i++) {
      newModuleDetails.push({
        content: this.subCategory.moduleDetails[i]?.content || ''
      });
    }

    this.subCategory.moduleDetails = newModuleDetails;
  }

  handleDurationSelection(event: any): void {
    this.subCategory.duration = this.durationOptions.find((item: Dropdown) => item.id === event.id) || new Dropdown(undefined, undefined);
  }

  handleModuleSelection(event: any): void {
    this.onModuleChange(event.id);
  }

  onSubmit() {
    this.activeMatProgressBar();

    if (this.subCategory.duration.text && this.subCategory.module.text) {
      const payload = {
        id: this.subCategory._id,
        course_name: this.subCategory.courseName,
        duration: parseInt(this.subCategory.duration.text),
        module: parseInt(this.subCategory.module.text),
        data_status: this.subCategory.data_status,
        module_details: this.subCategory.moduleDetails.map((detail: any) =>
          detail.content.split(',').map((item: any) => item.trim()).filter(Boolean)
        )
      };

      this.courseService.editSubCategory(payload).subscribe({
        next: () => {
          this.hideMatProgressBar();
          this.openDialog("Course", 'Sub-course category has been updated successfully', ResponseTypeColor.SUCCESS, '/admin-panel/course-list');
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Course", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
        }
      });
    }
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: any): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) window.location.href = navigateRoute;
    });
  }
}
