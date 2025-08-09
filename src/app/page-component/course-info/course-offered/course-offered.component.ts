import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Endpoints, GetBaseURL } from '../../../endpoints/endpoints';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faMinus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../../service/course/course.service';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubCategory, ParentCategory } from '../../../model/course/course.model';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetFormattedCurrentDatetime } from '../../../utility/common-util';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, Dropdown, ResponseTypeColor } from '../../../constants/commonConstants';
import { CustomConfirmDialogComponent } from '../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { EnumsService } from '../../../service/enums/enums.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-course-offered',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule, MatProgressBarModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './course-offered.component.html',
  styleUrl: './course-offered.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: '0' })),
      state('expanded', style({ height: '*', opacity: '1' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CourseOfferedComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faMinus = faMinus;
  faCircleXmark = faCircleXmark;

  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  displayedColumns: string[] = ['expand', 'courseCode', 'courseName', 'subCourseCount', 'status', 'action'];
  subCoursesDisplayedColumns: string[] = ['subCourseCode', 'subCourseName', 'subCourseDuration', 'subCourseModule', 'status', 'subCourseAction'];

  dataSource = new MatTableDataSource<any>();
  currentCourses: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  courseCount: number = 0;
  page_size: number = 5;

  expandedElement: any | null;

  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private enumsService: EnumsService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    await this.fetchCourses();
  }

  async fetchCourses() {
    this.activeMatProgressBar();
    this.courseService.fetchAllCourses().subscribe({
      next: async (response) => {
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

  // Method to format duration (in days) into Months and Days
  formatDuration(days: number): string {
    if (days <= 0) return '0 Days';

    const months = Math.floor(days / 30); // Calculate whole months
    const remainingDays = days % 30; // Calculate remaining days

    let result = '';
    if (months > 0) {
      result += `${months} Month${months > 1 ? 's' : ''}`;
    }
    if (remainingDays > 0) {
      if (months > 0) result += ' '; // Add space between months and days
      result += `${remainingDays} Day${remainingDays > 1 ? 's' : ''}`;
    }

    return result || '0 Days'; // Fallback in case result is empty
  }

  viewCourse(courseCode: string) {
    this.router.navigate(['/course-offered/view-course', courseCode]);
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

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
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

