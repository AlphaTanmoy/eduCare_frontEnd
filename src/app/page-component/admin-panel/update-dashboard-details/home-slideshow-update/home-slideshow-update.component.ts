import { Component } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-slideshow-update',
  imports: [ImageCropperComponent, CommonModule],
  templateUrl: './home-slideshow-update.component.html',
  styleUrl: './home-slideshow-update.component.css'
})
export class HomeSlideshowUpdateComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: any | null = null;
  displayProperty: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

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

  resetCroppedImage(){
    this.croppedImage = null;
    this.displayProperty = false;
  }
}
