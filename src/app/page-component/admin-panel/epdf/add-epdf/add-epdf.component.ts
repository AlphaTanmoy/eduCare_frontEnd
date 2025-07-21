import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { Endpoints, GetBaseURL } from '../../../../endpoints/endpoints';
import { CourseService } from '../../../../service/course/course.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

interface CourseOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-epdf',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './add-epdf.component.html',
  styleUrls: ['./add-epdf.component.css']
})
export class AddEpdfComponent implements OnInit, OnDestroy {
  epdfForm: FormGroup;
  isLoading = false;
  courseOptions: CourseOption[] = [];
  isLoadingCourses = false;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private courseService: CourseService,
    private dialog: MatDialog
  ) {
    // Google Drive URL pattern
    const googleDrivePattern = /^https:\/\/drive\.google\.com\/file\/d\/[^\/]+\/view\?usp=sharing$/;
    
    this.epdfForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [
        Validators.required, 
        Validators.pattern(googleDrivePattern)
      ]],
      course_codes: [[], Validators.required]
    });
  }

  private loadCourses(): void {
    this.isLoadingCourses = true;
    const subscription = this.courseService.getAllSubCourses().subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.courseOptions = response.data.map((course: any) => ({
            value: course.course_code,
            viewValue: `${course.course_name} : ${course.course_code}`
          }));
          
          if (this.courseOptions.length === 0) {
            const dialogRef = this.dialog.open(CustomAlertComponent, {
              data: {
                title: 'Info',
                text: 'No courses available. Please add courses first.',
                type: 0,
                showCancelButton: false
              }
            });

            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/e-pdf-view']).then(() => {
                window.location.reload();
              });
            });
          }
        } else {
          const dialogRef = this.dialog.open(CustomAlertComponent, {
            data: {
              title: 'Error',
              text: 'Failed to load courses. Please try again later.',
              type: 0,
              showCancelButton: false
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/e-pdf-view']).then(() => {
              window.location.reload();
            });
          });
        }
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        const dialogRef = this.dialog.open(CustomAlertComponent, {
          data: {
            title: 'Error',
            text: 'Failed to load courses. Please try again later.',
            type: 0,
            showCancelButton: false
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/e-pdf-view']).then(() => {
            window.location.reload();
          });
        });
      },
      complete: () => {
        this.isLoadingCourses = false;
        subscription.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.bootstrapElements = loadBootstrap();
  }

  onCancel(): void {
    // Check if form has unsaved changes
    if (this.epdfForm.dirty) {
      const dialogRef = this.dialog.open(CustomAlertComponent, {
        data: {
          title: 'Confirm',
          text: 'You have unsaved changes. Are you sure you want to leave?',
          type: 1,
          showCancelButton: true
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.router.navigate(['/e-pdf-view']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      this.router.navigate(['/e-pdf-view']).then(() => {
        window.location.reload();
      });
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
    // Only navigate if not already navigating
    if (this.router.url.includes('add') && !this.router.navigated) {
      this.router.navigate(['/e-pdf-view']);
    }
  }

  isCourseSelected(courseCode: string): boolean {
    const selectedCourses = this.epdfForm.get('course_codes')?.value || [];
    return selectedCourses.includes(courseCode);
  }

  onCourseToggle(courseCode: string, isChecked: boolean): void {
    const currentCourses = [...(this.epdfForm.get('course_codes')?.value || [])];
    
    if (isChecked) {
      // Add course if not already in the array
      if (!currentCourses.includes(courseCode)) {
        currentCourses.push(courseCode);
      }
    } else {
      // Remove course
      const index = currentCourses.indexOf(courseCode);
      if (index > -1) {
        currentCourses.splice(index, 1);
      }
    }
    
    // Update form control value
    this.epdfForm.patchValue({
      course_codes: currentCourses
    });
    
    // Mark as touched to trigger validation
    this.epdfForm.get('course_codes')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.epdfForm.invalid) {
      this.epdfForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.epdfForm.value;
    const subscription = this.http.post(GetBaseURL() + Endpoints.epdf.create_epdf, formData)
      .subscribe({
        next: () => {
          const dialogRef = this.dialog.open(CustomAlertComponent, {
            data: {
              title: 'Success',
              text: 'EPDF added successfully!',
              type: 0,
              showCancelButton: false
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/e-pdf-view']).then(() => {
              window.location.reload();
            });
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding EPDF:', error);
          const dialogRef = this.dialog.open(CustomAlertComponent, {
            data: {
              title: 'Error',
              text: error.error?.message || 'Failed to add EPDF. Please try again.',
              type: 0,
              showCancelButton: false
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            window.location.reload();
          });
        },
        complete: () => {
          this.isLoading = false;
          subscription.unsubscribe();
        }
      });
  }

  // Removed openDialog method as we're now handling dialogs directly where needed
}
