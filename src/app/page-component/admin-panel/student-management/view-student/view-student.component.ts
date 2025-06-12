import { Component, Inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { YesNoStatus, YesNoStatusDescriptions } from '../../../../constants/commonConstants';

@Component({
  selector: 'app-view-student',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.css'
})
export class ViewStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewStudentComponent>,
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    console.log(this.data);
  }

  FormatDateTime(datetimeValue: any) {
    return GetFormattedCurrentDatetime(new Date(datetimeValue));
  }

  GetIsEmailVerifiedLabel(value: number): string {
    return YesNoStatusDescriptions[value as YesNoStatus] || 'Unknown';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'image/default_student_photo.jpg'; // path to your default image
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
