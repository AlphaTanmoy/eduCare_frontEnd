import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../constants/commonConstants';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-custom-confirm-dialog-with-remarks',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './custom-confirm-dialog-with-remarks.component.html',
  styleUrl: './custom-confirm-dialog-with-remarks.component.css'
})
export class CustomConfirmDialogWithRemarksComponent {
  ResponseTypeColor = ResponseTypeColor;
  formattedText: string = '';
  remarks: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    public dialogRef: MatDialogRef<CustomConfirmDialogWithRemarksComponent>,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.formattedText = this.data.text.replace(/\n/g, '<br>');
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  sendConfirmStatus(status: boolean) {
    let obj = {
      status: status,
      remarks: this.remarks
    };

    this.dialogRef.close(obj);
  }
}
