import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../service/admin/admin.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-home-slideshow-update',
  imports: [ImageCropperComponent, CommonModule, MatProgressBarModule],
  templateUrl: './home-slideshow-update.component.html',
  styleUrl: './home-slideshow-update.component.css'
})

export class HomeSlideshowUpdateComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  imageChangedEvent: Event | null = null;
  croppedImage: any | null = null;
  displayProperty: boolean = false;
  matProgressBarVisible: boolean = false;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private sanitizer: DomSanitizer,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.displayProperty = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    } else {
      this.croppedImage = null;
    }
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  resetCroppedImage() {
    this.croppedImage = null;
    this.displayProperty = false;
  }

  uploadDashboardSlideshowImage() {
    this.activeMatProgressBar();

    const imgElement = document.getElementById("cropepdSlideshowImage") as HTMLImageElement;

    if (!imgElement || !imgElement.src) {
      this.hideMatProgressBar();
      window.alert('No image found!');
      return;
    }

    fetch(imgElement.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });

        this.adminService.uploadFile(file).subscribe({
          next: (resposne: any) => {
            if (resposne.status !== 200) {
              console.error(resposne.message);
              this.hideMatProgressBar();
              return;
            }

            this.hideMatProgressBar();
            window.alert(resposne.message);
            location.reload();
          },
          error: (err) => {
            this.hideMatProgressBar();
            window.alert('File upload failed');
          }
        });
      })
      .catch(error => {
        this.hideMatProgressBar();
        window.alert('File upload failed');
      });
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }
}
