import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../../constants/commonConstants';

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
  readonly dialog = inject(MatDialog);
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private sanitizer: DomSanitizer,
    private dashboardService: DashboardService,
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
    const imgElement = document.getElementById("cropepdSlideshowImage") as HTMLImageElement;

    if (!imgElement || !imgElement.src) {
      this.openDialog("Dashboard", "Please select an image", ResponseTypeColor.INFO, false);
      return;
    }

    this.activeMatProgressBar();

    fetch(imgElement.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });

        this.dashboardService.uploadDashboardSlideshowImageFile(file).subscribe({
          next: (resposne: any) => {
            this.hideMatProgressBar();

            if (resposne.status !== 200) {
              this.openDialog("Dashboard", resposne.message, ResponseTypeColor.ERROR, false);
              return;
            }
        
            this.openDialog("Dashboard", resposne.message, ResponseTypeColor.SUCCESS, true);
          },
          error: (err) => {
            this.hideMatProgressBar();
            this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, false);
          }
        });
      })
      .catch(error => {
        this.hideMatProgressBar();
        this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, false);
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
