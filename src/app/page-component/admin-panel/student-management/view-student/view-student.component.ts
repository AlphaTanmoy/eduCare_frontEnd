import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, EnrollmentStatus, EnrollmentStatusDescriptions, ResponseTypeColor, StudentDocumentName, YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';
import { StudentService } from '../../../../service/student/student.service';
import { convertBlobToBase64 } from '../../../../utility/common-util';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';

@Component({
  selector: 'app-view-student',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.css'
})
export class ViewStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  ActiveInactiveStatus = ActiveInactiveStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  EnrollmentStatus = EnrollmentStatus;
  EnrollmentStatusDescriptions = EnrollmentStatusDescriptions;

  student_photo_base64: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewStudentComponent>,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    console.log(this.data);
    this.GetStudentPhotoStream(this.data.student_guid);
  }

  GetStudentPhotoStream(student_guid: string) {
    this.activeMatProgressBar();

    this.studentService.getStudentPhotoStream(student_guid).subscribe({
      next: async (imageData: Blob) => {
        this.hideMatProgressBar();
        const base64format = await convertBlobToBase64(imageData);
        this.student_photo_base64 = `data:image/jpg;base64,${base64format}`;
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Failed to fetch student's photo", ResponseTypeColor.ERROR, false);
      }
    });
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
  }

  GetIsEmailVerifiedLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  GetEnrollmentStatusLabel(value: string): string {
    return EnrollmentStatusDescriptions[value as EnrollmentStatus] || 'Unknown';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'defaults/avatar-default.svg'; // path to your default image
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
