import { Component } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-image-cropper',
  imports: [ImageCropperComponent, CommonModule],
  templateUrl: './custom-image-cropper.component.html',
  styleUrl: './custom-image-cropper.component.css'
})

export class CustomImageCropperComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: any | null = null;
  displayProperty: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {
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
}