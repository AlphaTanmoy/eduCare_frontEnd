import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardSlideshowImage } from '../../model/dashboard/dashboard.model';
import { DashboardService } from '../../service/dashboard/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  images: DashboardSlideshowImage[] = [];
  // images: string[] = [
  //   '/image/slider_1.jpg',
  //   '/image/slider_2.jpg',
  //   '/image/slider_4.jpg',
  //   '/image/slider_5.jpg',
  // ];
  currentIndex = 0;
  intervalId: any;
  maxHeight = 0;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private renderer: Renderer2, 
    private elRef: ElementRef,
    private sanitizer: DomSanitizer,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.dashboardService.getAllImages().subscribe({
      next: (resposne) => {
        try {
          console.log(resposne);
          if (resposne.status !== 200) {
            console.error(resposne.message);
            return;
          }

          this.images = resposne.data.map((item: { fileId: string }) => new DashboardSlideshowImage(item.fileId, null));

          this.images.forEach((image: DashboardSlideshowImage) => {
            this.dashboardService.getImageStream(image.fileId).subscribe({
              next: (response1) => {
                const objectURL = URL.createObjectURL(response1);
                image.fileStream = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              },
              error: (err) => {
                console.error("Error fetching image stream:", err);
              }
            });
          });
        } catch (error) {
          console.error("Error processing images:", error);
        }
      },
      error: (err) => {
        console.error("Error fetching images:", err);
      }
    });

    this.startSlider();
  }

  startSlider() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  ngOnDestroy() {
    removeBootstrap(this.bootstrapElements);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}