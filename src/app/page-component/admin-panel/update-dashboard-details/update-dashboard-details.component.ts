import { Component } from '@angular/core';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-update-dashboard-details',
  imports: [],
  templateUrl: './update-dashboard-details.component.html',
  styleUrl: './update-dashboard-details.component.css'
})

export class UpdateDashboardDetailsComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(private adminService: AdminService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a file first!';
      return;
    }

    this.adminService.uploadFile(this.selectedFile).subscribe({
      next: (event: any) => {
        console.log(event)
        if (event.type === 1 && event.total) {
          // Update upload progress
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.body) {
          this.uploadMessage = `File uploaded successfully! File ID: ${event.body.fileId}`;
          window.alert(`File uploaded successfully! File ID: ${event.body.fileId}`);
        }
      },
      error: (err) => {
        this.uploadMessage = `Upload failed: ${err.message}`;
        window.alert(`Upload failed: ${err.message}`);
      }
    });
  }
}
