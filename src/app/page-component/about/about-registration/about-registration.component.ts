import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewHomeBrandComponent } from '../../../home-page-components/view-home-brand/view-home-brand.component';

interface Certificate {
  id: number;
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-about-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, NgSwitch, NgSwitchCase, FormsModule, ViewHomeBrandComponent],
  templateUrl: './about-registration.component.html',
  styles: []
})
export class AboutRegistrationComponent implements OnInit {
  // Banner images for slideshow
  bannerImages = [
    'registration/reg1.jpg',
    'registration/reg2.jpg',
  ];
  currentBannerIndex = 0;
  private bannerInterval: any;

  // Certificate images for the grid
  certificateList: Certificate[] = [
    { id: 1, imageUrl: 'certificates/certi1.jpg', title: 'Certificate 1' },
    { id: 2, imageUrl: 'certificates/certi1.jpg', title: 'Certificate 2' },
    { id: 3, imageUrl: 'certificates/certi1.jpg', title: 'Certificate 3' },
    { id: 4, imageUrl: 'certificates/certi1.jpg', title: 'Certificate 4' },
    { id: 5, imageUrl: 'certificates/certi1.jpg', title: 'Certificate 5' },
  ];

  ngOnInit(): void {
    this.startBannerSlideshow();
  }

  ngOnDestroy(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }

  private startBannerSlideshow(): void {
    this.bannerInterval = setInterval(() => {
      this.nextBanner();
    }, 5000);
  }

  nextBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerImages.length;
  }

  previousBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.bannerImages.length) % this.bannerImages.length;
  }

  goToBanner(index: number): void {
    this.currentBannerIndex = index;
  }
}
