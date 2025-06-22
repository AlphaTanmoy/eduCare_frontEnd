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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.certificate_file = input.files?.[0] || null;
  }

  Save() {
    if (this.certificate_file) {
      this.dialogRef.close(this.certificate_file);
    } 
  }

  Close() {
    this.dialogRef.close();
  }
}
