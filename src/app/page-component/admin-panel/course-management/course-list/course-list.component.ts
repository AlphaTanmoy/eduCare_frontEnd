import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../endpoints/endpoints';
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


@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatProgressBarModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CourseListComponent implements OnInit, OnDestroy {
  courses: any;
  loading: boolean = true;
  error: string | null = null;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faMinus = faMinus;

  displayedColumns: string[] = ['expand', 'courseName', 'subCourseCount', 'action'];
  subCoursesDisplayedColumns: string[] = ['courseCode', 'courseName', 'duration', 'module', 'action'];
  dataSource = new MatTableDataSource<any>();
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

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  fetchCourses() {
    this.loading = true;
    this.activeMatProgressBar();
    this.courseService.fetchAllCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.courseCount = response.data.length;
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
        this.hideMatProgressBar();
      },
      error: (error) => {
        this.error = 'Failed to fetch courses';
        this.loading = false;
        console.error('Error fetching courses:', error);
        this.hideMatProgressBar();
      }
    });
  }

  addParentCategory() {
    this.router.navigate(['/admin-panel/add/primary-course']);
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
    console.log('Delete called with id:', id, 'isParent:', isParent);

    if (confirm('Are you sure you want to delete this category?')) {
      const endpoint = isParent
        ? Endpoints.course.delete_parent_category
        : Endpoints.course.delete_sub_category;

      this.courseService.deleteCourse(endpoint, id).subscribe({
        next: () => {
          this.fetchCourses();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      });
    }
  }

  viewCourse(courseCode: string) {
    this.router.navigate(['/admin-panel/view-course', courseCode]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(element: any) {
    element.expanded = !element.expanded;
    element.viewSubCourse = element.expanded ? '-' : '+';
    this.expandedElement = element.expanded ? element : null;
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
