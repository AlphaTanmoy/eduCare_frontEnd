import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

interface SubCategory {
  id: string;
  courseCode: string;
  courseName: string;
  duration: string;
  module: string;
  moduleDetails: string[][];
}

@Component({
  selector: 'app-edit-sub-course-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-sub-course-category.component.html',
  styleUrl: './edit-sub-course-category.component.css'
})
export class EditSubCourseCategoryComponent implements OnInit {
  subCategory: SubCategory = {
    id: '',
    courseCode: '',
    courseName: '',
    duration: '',
    module: '',
    moduleDetails: [[]]
  };
  
  loading: boolean = false;
  error: string | null = null;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadSubCategory(id);
    } else {
      this.error = 'No sub-category ID provided';
    }
  }

  loadSubCategory(id: string) {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (response) => {
        this.subCategory = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load sub-category';
        this.loading = false;
        console.error('Error loading sub-category:', error);
      }
    });
  }

  addModuleDetail() {
    this.subCategory.moduleDetails.push([]);
  }

  addModuleItem(moduleIndex: number) {
    this.subCategory.moduleDetails[moduleIndex].push('');
  }

  removeModuleDetail(index: number) {
    this.subCategory.moduleDetails.splice(index, 1);
  }

  removeModuleItem(moduleIndex: number, itemIndex: number) {
    this.subCategory.moduleDetails[moduleIndex].splice(itemIndex, 1);
  }

  onSubmit() {
    if (!this.subCategory.courseName || !this.subCategory.duration || !this.subCategory.module) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.courseService.editSubCategory(
      this.subCategory.id,
      this.subCategory.courseCode,
      this.subCategory.courseName,
      this.subCategory.duration,
      this.subCategory.module,
      this.subCategory.moduleDetails
    ).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['/admin-panel/course-list']);
        } else {
          this.error = 'Failed to update sub-category';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to update sub-category';
        this.loading = false;
        console.error('Error updating sub-category:', error);
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
