import { Component, Inject, Input, Optional } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, EnrollmentStatus, EnrollmentStatusDescriptions, YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';


@Component({
  selector: 'app-show-student-details',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.css'
})
export class ShowStudentDetailsComponent {
  @Input() student!: any;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ActiveInactiveStatus = ActiveInactiveStatus;
  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  EnrollmentStatus = EnrollmentStatus;
  EnrollmentStatusDescriptions = EnrollmentStatusDescriptions;

  student_info: any = {};

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.student_info = this.student;
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
}
