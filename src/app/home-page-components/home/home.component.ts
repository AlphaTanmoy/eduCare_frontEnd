import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { DashboardSlideshowImage } from '../../model/dashboard/dashboard.model';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseTypeColor } from '../../constants/commonConstants';
import { IndexedDbService } from '../../service/indexed-db/indexed-db.service';
import { convertBlobToBase64 } from '../../utility/common-util';
import { IndexedDBItemKey } from '../../constants/commonConstants';
import { ApplyFranchiseHomeComponent } from '../apply-franchise-home/apply-franchise-home.component';
import { ViewHomeCenterComponent } from '../view-home-center/view-home-center.component';
import { ViewYtLinkComponent } from '../view-yt-link/view-yt-link.component';
import { HomeHappyStudentsComponent } from '../home-happy-students/home-happy-students.component';
import { ViewHomeBrandComponent } from '../view-home-brand/view-home-brand.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule, 
    MatProgressBarModule,
    ApplyFranchiseHomeComponent,
    ViewHomeCenterComponent,
    ViewYtLinkComponent,
    HomeHappyStudentsComponent,
    ViewHomeBrandComponent
  ],
  animations: [
    trigger('fadeAnimation', [
      state('true', style({ opacity: 1, zIndex: 1 })),
      state('false', style({ opacity: 0, zIndex: 0 })),
      transition('false => true', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition('true => false', [
        animate('800ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  images: DashboardSlideshowImage[] = [];
  currentIndex = 0;
  intervalId: any;
  allImageRendered = false;
  matProgressBarVisible = false;
  isLoading = true;
  readonly dialog = inject(MatDialog);
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private indexedDbService: IndexedDbService
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();

    let cachedImages = await this.indexedDbService.getItem(IndexedDBItemKey.dashboard_slideshow_images);

    if (cachedImages && cachedImages.value.length > 0) {
      this.images = cachedImages.value;

      this.allImageRendered = true;
      this.hideMatProgressBar();
      this.startSlider();
      return;
    }

    this.dashboardService.getAllDashboardSlideshowImages().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.hideMatProgressBar();
            this.openDialog("Home", "Internal server error", ResponseTypeColor.ERROR, false);
            return;
          }

          this.images = response.data.map((item: { fileId: string }) => new DashboardSlideshowImage(item.fileId, null));

          if (this.images.length === 0) {
            this.hideMatProgressBar();
            return;
          }

          let renderedImage = 0;
          const totalImages = this.images.length;

          this.images.forEach((image: DashboardSlideshowImage) => {
            this.dashboardService.getImageStream(image.fileId).subscribe({
              next: async (imageData) => {
                const base64String = await convertBlobToBase64(imageData);
                image.fileStream = `data:image/jpg;base64,${base64String}`;

                renderedImage++;

                if (renderedImage === totalImages) {
                  await this.indexedDbService.addItem(IndexedDBItemKey.dashboard_slideshow_images, this.images);
                  this.allImageRendered = true;
                  this.hideMatProgressBar();
                  this.startSlider();
                }
              },
              error: (err) => {
                this.openDialog("Home", "Internal server error", ResponseTypeColor.ERROR, false);
                renderedImage++;
              }
            });
          });
        } catch (error) {
          this.openDialog("Home", "Internal server error", ResponseTypeColor.ERROR, false);
          this.hideMatProgressBar();
        }
      },
      error: (err) => {
        this.openDialog("Home", "Internal server error", ResponseTypeColor.ERROR, false);
        this.hideMatProgressBar();
      }
    });
  }

  startSlider() {
    if (this.images.length <= 1) return;

    this.stopSlider();

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.cdr.detectChanges();
    }, 4000);
  }

  stopSlider() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    removeBootstrap(this.bootstrapElements);
    this.stopSlider();

    this.images.forEach(image => {
      if (image.fileStream) {
        const url = image.fileStream.toString();
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      }
    });
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.isLoading = false;
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