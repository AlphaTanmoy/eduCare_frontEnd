import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Endpoints, GetBaseURL } from '../../../../endpoints/endpoints';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../../../service/course/course.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubCategory, ParentCategory } from '../../../../model/course/course.model';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { AddPrimaryCourseCategoryComponent } from '../add-primary-course-category/add-primary-course-category.component';
import { EditPrimaryCourseCategoryComponent } from '../edit-primary-course-category/edit-primary-course-category.component';


@Component({
  selector: 'app-course-list',
  imports: [CommonModule, FontAwesomeModule, MatProgressBarModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: '0' })),
      state('expanded', style({ height: '*', opacity: '1' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CourseListComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faMinus = faMinus;

  displayedColumns: string[] = ['expand', 'courseCode', 'courseName', 'subCourseCount', 'createdAt', 'action'];
  subCoursesDisplayedColumns: string[] = ['subCourseCode', 'subCourseName', 'subCourseDuration', 'subCourseModule', 'createdAt', 'subCourseAction'];
  dataSource = new MatTableDataSource<any>();
  currentCourses: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  courseCount: number = 0;
  page_size: number = 5;

  expandedElement: any | null;

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.fetchCourses();
    this.bootstrapElements = loadBootstrap();
  }

  fetchCourses() {
    this.activeMatProgressBar();
    this.courseService.fetchAllCourses().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.courseCount = response.data.length;
          this.dataSource.data = response.data;
          this.currentCourses = response.data;
          this.dataSource.paginator = this.paginator;
        } else {
          this.openDialog("Course", response.message, ResponseTypeColor.ERROR, false);
        }

        this.hideMatProgressBar();
      },
      error: (error) => {
        this.openDialog("Course", "Failed to fetch courses", ResponseTypeColor.ERROR, false);
        this.hideMatProgressBar();
      }
    });
  }

  addParentCategory() {
    const dialogRef = this.dialog.open(AddPrimaryCourseCategoryComponent, { data: { currentCourses: this.currentCourses } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activeMatProgressBar();

        this.courseService.addCourseCategory(result).subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.fetchCourses();
              this.openDialog("Course", "New course category has been added successfully", ResponseTypeColor.SUCCESS, false);
            } else {
              this.hideMatProgressBar();
              this.openDialog("Course", response.message, ResponseTypeColor.ERROR, false);
            }
          },
          error: (error) => {
            this.hideMatProgressBar();
            this.openDialog("Course", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      }
    });
  }

  editParentCategory(id: string) {
    const dialogRef = this.dialog.open(EditPrimaryCourseCategoryComponent, { data: { course_id: id, currentCourses: this.currentCourses } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        // this.activeMatProgressBar();

        // this.courseService.addCourseCategory(result).subscribe({
        //   next: (response) => {
        //     if (response.status === 200) {
        //       this.fetchCourses();
        //       this.openDialog("Course", "New course category has been added successfully", ResponseTypeColor.SUCCESS, false);
        //     } else {
        //       this.hideMatProgressBar();
        //       this.openDialog("Course", response.message, ResponseTypeColor.ERROR, false);
        //     }
        //   },
        //   error: (error) => {
        //     this.hideMatProgressBar();
        //     this.openDialog("Course", error.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
        //   }
        // });
      }
    });
  }

  addSubCategory(parentCourse: ParentCategory) {
    this.router.navigate(['/admin-panel/add/sub-course'], {
      queryParams: { parentCourseId: parentCourse.id }
    });
  }

  editCategory(id: string, isParent: boolean) {
    if (!isParent) {
      this.router.navigate(['/admin-panel/edit-sub-course'], {
        queryParams: { id }
      });
    }
  }

  deleteCategory(id: string, isParent: boolean) {
    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, {
      data: {
        text: isParent ?
          "Do you want to delete this course category?" :
          "Do you want to delete this sub-course category?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const endpoint = isParent
          ? Endpoints.course.delete_parent_category
          : Endpoints.course.delete_sub_category;

        this.courseService.deleteCourse(endpoint, id).subscribe({
          next: () => {
            this.openDialog("Course",
              isParent ?
                "Course category has been deleted succesfully" :
                "Sub-course category has been deleted succesfully",
              ResponseTypeColor.SUCCESS, false);
            this.fetchCourses();
          },
          error: (error) => {
            this.openDialog("Course",
              isParent ?
                "Failed to delete course category" :
                "Failed to delete sub-course category",
              ResponseTypeColor.ERROR, false);
          }
        });
      }
    });
  }

  viewCourse(courseCode: string) {
    this.router.navigate(['/admin-panel/view-course', courseCode]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(element: any) {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].courseCode !== element.courseCode) {
        this.dataSource.data[i].expanded = false;
      }
    }

    element.expanded = !element.expanded;
    element.viewSubCourse = element.expanded ? '-' : '+';
    this.expandedElement = element.expanded ? element : null;
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
