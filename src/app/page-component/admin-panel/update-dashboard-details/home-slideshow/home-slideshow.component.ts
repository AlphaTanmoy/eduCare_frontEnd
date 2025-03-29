import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { AdminService } from '../../../../service/admin/admin.service';
import { DashboardSlideshowImage } from '../../../../model/dashboard/dashboard.model';
import { CustomImageCropperComponent } from '../../../../common-component/custom-image-cropper/custom-image-cropper.component';

@Component({
  selector: 'app-home-slideshow',
  imports: [CustomImageCropperComponent, CommonModule],
  templateUrl: './home-slideshow.component.html',
  styleUrl: './home-slideshow.component.css'
})
export class HomeSlideshowComponent {
  selectedFile: File | null = null;
    uploadProgress: number = 0;
    uploadMessage: string = '';

    images!: DashboardSlideshowImage[];
  
    constructor(
      private dashboardService: DashboardService,
      private adminService: AdminService
    ) {}

    ngOnInit(): void {
      this.dashboardService.getAllImages().subscribe({
        next: (data) => {
          try {
            console.log(data);
            this.images = data.map((item: { fileId: string }) => new DashboardSlideshowImage(item.fileId, null));

            this.images.forEach((image: DashboardSlideshowImage) => {
              this.dashboardService.getImageStream(image.fileId).subscribe({
                next: (data) => {
                  image.fileStream = data;
                },
                error: (err) => {
                  console.error("Error fetching image stream:", err);
                }
              });
            });

            console.log("images",this.images)
          } catch (error) {
            console.error("Error processing images:", error);
          }
        },
        error: (err) => {
          console.error("Error fetching images:", err);
        }
      });
    }
  
    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0] || null;
    }

    deleteDashboardSlideshowImage(image: DashboardSlideshowImage) {
        console.log(image);
    }
  
    uploadDashboardSlideshowImage() {
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
