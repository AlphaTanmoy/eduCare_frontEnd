import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { StyledButtonComponent } from '../styled-button/styled-button.component';

@Component({
  selector: 'app-common-dialog',
  standalone: true,
  imports: [MatDialogModule, StyledButtonComponent],
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent {
  @Input() title: string = 'Notification';
  @Input() message: string = 'Message goes here';
  @Input() buttonText: string = 'OK';

  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string; buttonText?: string }
  ) {
    if (data) {
      this.title = data.title || this.title;
      this.message = data.message || this.message;
      this.buttonText = data.buttonText || this.buttonText;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
