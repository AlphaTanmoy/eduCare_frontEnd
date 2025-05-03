import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-confirm-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrl: './custom-confirm-dialog.component.css'
})

export class CustomConfirmDialogComponent {
  ResponseTypeColor = ResponseTypeColor;
  formattedText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string; type: ResponseType },
    public dialogRef: MatDialogRef<CustomConfirmDialogComponent>,
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
    this.dialogRef.close(status);
  }
}
