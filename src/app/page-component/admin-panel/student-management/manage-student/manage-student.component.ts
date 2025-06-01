import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { StudentService } from '../../../../service/student/student.service';
import { firstValueFrom } from 'rxjs';
import { ResponseTypeColor, YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { faEdit, faCircleXmark, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { ViewStudentComponent } from '../view-student/view-student.component';

@Component({
  selector: 'app-manage-student',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginator, MatSortModule, MatInputModule, MatFormFieldModule, FontAwesomeModule, MatProgressBarModule],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.css'
})
export class ManageStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 5;

  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faCircleXmark = faCircleXmark;

  YesNoStatus = YesNoStatus;
  YesNoStatusDescriptions = YesNoStatusDescriptions;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  totalCount: number = 0;

  displayedColumns: string[] = ['student_name', 'gender', 'email', 'phone', 'address', 'franchise', 'is_email_verified', 'created_at', 'action'];

  constructor(
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.studentService.getAllAvailableStudents());
      if (res.status !== 200) {
        this.openDialog("Student", res.message, ResponseTypeColor.ERROR, false);
        return;
      }

      this.dataSource.data = res.data;
      this.totalCount = res.data.length;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  AddStudent() {
    window.location.href = "academic/register-student";
  }

  ViewStudent(student: any){
    const dialogRef = this.dialog.open(ViewStudentComponent, { data: student });
  }

  EditStudent(id: any) {

  }

  DeleteStudent(id: any) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetVerificationStatusLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  GetFormattedAddress(value: string): string {
    value = value.replace(/\n/g, '<br>');
    return value;
  }

  GetIsEmailVerifiedLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
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
        window.location.reload();
      }
    });
  }
}
