import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FranchiseService } from '../../service/franchise/franchise.service';

interface Franchise {
  franchiseName: string;
  franchiseHeadName: string;
  franchiseHeadImage: string | null;
}

@Component({
  selector: 'app-view-home-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-home-center.component.html',
  styleUrls: ['./view-home-center.component.css']
})
export class ViewHomeCenterComponent implements OnInit, OnDestroy {
  franchises: Franchise[] = [];
  currentSlide = 0;
  slidesToShow = 2; // Show 2 franchises at a time
  maxFranchises = 10; // Maximum number of franchises to show
  isLoading = false;
  error: string | null = null;
  private slideInterval: any = null;
  private readonly SLIDE_INTERVAL_MS = 5000; // 5 seconds

  constructor(
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFranchises();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  loadFranchises(): void {
    this.isLoading = true;
    this.error = null;
    
    this.franchiseService.getAllFranchises().subscribe({
      next: (response: any) => {
        if (response?.data?.length > 0) {
          // Limit to maxFranchises and create circular buffer
          const franchises = response.data.slice(0, this.maxFranchises);
          this.franchises = [...franchises, ...franchises, ...franchises];
          
          // Start from the middle of the tripled array
          this.currentSlide = franchises.length;
          
          // Start auto-sliding after franchises are loaded
          this.setupAutoSlide();
        } else {
          this.error = 'No franchises found';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading franchises:', error);
        this.error = 'Failed to load franchises. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get trackTransform(): string {
    if (!this.franchises || this.franchises.length === 0) return 'translateX(0)';
    
    const slideWidth = 100 / this.slidesToShow;
    const position = -(this.currentSlide * slideWidth);
    
    return `translateX(${position}%)`;
  }

  getImageUrl(franchise: Franchise): string {
    return franchise?.franchiseHeadImage || 'assets/images/placeholder.png';
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.png';
  }

  nextSlide(): void {
    if (!this.franchises || this.franchises.length === 0) return;
    
    this.currentSlide++;
    this.cdr.detectChanges();
    
    // If we reach the end of the duplicated array, reset to the middle section
    if (this.currentSlide >= (this.franchises.length / 3) * 2) {
      const track = document.querySelector('.franchise-slider-track') as HTMLElement;
      if (track) {
        track.style.transition = 'none';
      }
      
      // Reset to the middle section
      this.currentSlide = this.franchises.length / 3;
      this.cdr.detectChanges();
      
      // Force reflow and re-enable transition
      setTimeout(() => {
        if (track) {
          track.style.transition = 'transform 0.5s ease-in-out';
        }
      }, 10);
    }
  }

  prevSlide(): void {
    if (!this.franchises || this.franchises.length <= this.slidesToShow) return;
    
    this.currentSlide--;
    
    // If we go before the start, reset to the middle section
    if (this.currentSlide < 0) {
      this.currentSlide = (this.franchises.length / 3) * 2 - 1;
    }
    
    this.cdr.detectChanges();
  }

  isActiveSlide(index: number): boolean {
    if (!this.franchises || !this.franchises.length) return false;
    
    // Calculate the center of the visible slides
    const centerIndex = Math.floor(this.slidesToShow / 2);
    const activeIndex = (this.currentSlide + centerIndex) % (this.franchises.length / 3);
    
    // Check if the current index is within the visible range
    return index >= this.currentSlide && index < this.currentSlide + this.slidesToShow;
  }

  private setupAutoSlide(): void {
    this.clearAutoSlide();
    
    if (this.franchises && this.franchises.length > 0) {
      // Start from the middle of the tripled array
      this.currentSlide = Math.floor(this.franchises.length / 3);
      this.cdr.detectChanges();
      
      // Small delay before starting auto-slide
      setTimeout(() => {
        this.slideInterval = setInterval(() => {
          this.nextSlide();
        }, this.SLIDE_INTERVAL_MS);
      }, 1000);
    }
  }

  private clearAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }
}
