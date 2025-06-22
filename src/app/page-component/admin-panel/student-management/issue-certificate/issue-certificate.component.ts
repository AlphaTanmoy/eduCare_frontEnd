import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-issue-certificate',
  imports: [CommonModule],
  templateUrl: './issue-certificate.component.html',
  styleUrl: './issue-certificate.component.css'
})
export class IssueCertificateComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IssueCertificateComponent>,
  ) { }

  certificate_file: File | null = null;

  Save(){

  }

  Close(){
    this.dialogRef.close();
  }
}
