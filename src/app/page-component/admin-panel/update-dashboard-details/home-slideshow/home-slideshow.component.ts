import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { DashboardSlideshowImage } from '../../../../model/dashboard/dashboard.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeSlideshowUpdateComponent } from '../home-slideshow-update/home-slideshow-update.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';
import { DashboardInfo, ResponseTypeColor } from '../../../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home-slideshow',
  imports: [HomeSlideshowUpdateComponent, CommonModule, MatProgressBarModule],
  templateUrl: './home-slideshow.component.html',
  styleUrl: './home-slideshow.component.css'
})

export class HomeSlideshowComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadMessage: string = '';
  imageDivVisible: boolean = false;
  matProgressBarVisible: boolean = true;
  public dashboardInfo = DashboardInfo;
  readonly dialog = inject(MatDialog);
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  images: DashboardSlideshowImage[] = [];

  constructor(
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();

    this.dashboardService.getAllImages().subscribe({
      next: (resposne) => {
        try {
          if (resposne.status !== 200) {
            console.error(resposne.message);
            this.hideMatProgressBar();
            return;
          }

          this.images = resposne.data.map((item: { fileId: string }) => new DashboardSlideshowImage(item.fileId, null));

          let imageLoaded = 0;
          this.images.forEach((image: DashboardSlideshowImage) => {
            this.dashboardService.getImageStream(image.fileId).subscribe({
              next: (response1) => {
                const objectURL = URL.createObjectURL(response1);
                image.fileStream = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                imageLoaded++;

                if (imageLoaded === this.images.length) {
                  this.imageDivVisible = true;
                  this.hideMatProgressBar();
                }
              },
              error: (err) => {
                console.error("Error fetching image stream:", err);
                this.hideMatProgressBar();
              }
            });
          });

          if (this.images.length === 0) this.hideMatProgressBar();
        } catch (error) {
          console.error("Error processing images:", error);
          this.hideMatProgressBar();
        }
      },
      error: (err) => {
        console.error("Error fetching images:", err);
        this.hideMatProgressBar();
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  deleteDashboardSlideshowImage(image: DashboardSlideshowImage) {
    this.activeMatProgressBar();

    this.dashboardService.deleteDashboardSlideshowImageFile(image.fileId).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Dashboard", response.message, ResponseTypeColor.SUCCESS, true);
          return;
        }
        
        this.openDialog("Dashboard", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, false);     
      }
    });
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
