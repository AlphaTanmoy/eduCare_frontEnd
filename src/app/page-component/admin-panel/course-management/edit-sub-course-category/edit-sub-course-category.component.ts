import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../service/course/course.service';
import { EnumsService } from '../../../../service/enums/enums.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-sub-course-category.component.html',
  styleUrls: ['./edit-sub-course-category.component.css']
})
export class EditSubCourseCategoryComponent implements OnInit, OnDestroy {
  subCategory = {
    _id: '',
    courseName: '',
    courseCode: '',
    duration: '',
    module: '',
    moduleDetails: [] as ModuleDetail[]
  };
  loading = false;
  error: string | null = null;
  moduleOptions: EnumOption[] = [];
  durationOptions: EnumOption[] = [];
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private enumsService: EnumsService
  ) {}

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.error = 'No sub-category ID provided';
        return;
      }
      this.loading = true;
      this.fetchEnums();
      this.loadSubCategory(id);
    });
  }

  private fetchEnums() {
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
      }
    });

    this.enumsService.getEnumsByName('module_type').subscribe({
      next: (response) => {
        this.moduleOptions = response.data.map((item: any) => ({
          value: item.enum_value,
          label: this.formatEnumLabel(item.enum_value)
        }));
      },
      error: (error) => {
        console.error('Error fetching module types:', error);
        this.error = 'Failed to load module types';
      }
    });
  }

  private formatEnumLabel(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private loadSubCategory(id: string) {
    this.courseService.getSubCourseById(id).subscribe({
      next: response => {
        const data = response.data;
        this.subCategory = {
          _id: data._id,
          courseName: data.course_name,
          courseCode: data.course_code,
          duration: data.duration,
          module: data.module,
          moduleDetails: (data.module_details || []).map((arr: string[]) => ({
            content: arr.join(', ')
          }))
        };

        // If module exists but no details, generate empty ones
        if (data.module && (!data.module_details || data.module_details.length === 0)) {
          this.onModuleChange();
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sub-category';
        this.loading = false;
      }
    });
  }

  onModuleChange() {
    if (!this.subCategory.module) {
      this.subCategory.moduleDetails = [];
      return;
    }

    // Get the number from the module type (e.g., "MODULE_TYPE_2" -> 2)
    const moduleNumber = parseInt(this.subCategory.module.split('_').pop() || '1');

    // Create new array with existing data or empty content
    const newModuleDetails = [];
    for (let i = 0; i < moduleNumber; i++) {
      newModuleDetails.push({
        content: this.subCategory.moduleDetails[i]?.content || ''
      });
    }

    this.subCategory.moduleDetails = newModuleDetails;
  }

  onSubmit() {
    if (!this.subCategory._id) {
      this.error = 'No sub-category ID found';
      return;
    }

    const payload = {
      id: this.subCategory._id,
      course_name: this.subCategory.courseName,
      course_code: this.subCategory.courseCode,
      duration: this.subCategory.duration,
      module: this.subCategory.module,
      module_details: this.subCategory.moduleDetails.map(detail =>
        detail.content.split(',').map(item => item.trim()).filter(Boolean)
      )
    };

    this.loading = true;
    this.courseService.editSubCategory(payload).subscribe({
      next: () => this.router.navigate(['/admin-panel/course-list']),
      error: () => {
        this.error = 'Failed to update sub-category';
        this.loading = false;
      }
    });
  }

  navigateToCourseList() {
    this.router.navigate(['/admin-panel/course-list']);
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
