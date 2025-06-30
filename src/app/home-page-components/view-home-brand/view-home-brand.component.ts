// view-home-brand.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataService } from '../../service/master-data/master-data.service';

interface Brand {
  _id: string;
  brand_name: string;
  blob: {
    data: string;
    name: string;
  };
}

@Component({
  selector: 'app-view-home-brand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-home-brand.component.html',
  styleUrls: ['./view-home-brand.component.css']
})
export class ViewHomeBrandComponent implements OnInit, OnDestroy {
  brands: any[] = [];
  currentSlide = 0;
  slidesToShow = 6; // Show 6 brands at a time
  maxBrands = 15; // Maximum number of brands to show
  isLoading = false;
  error: string | null = null;
  showFewItems = false; // Flag for when there are 3 or fewer brands
  private slideInterval: any = null;
  private readonly SLIDE_INTERVAL_MS = 3000; // 3 seconds

  constructor(
    private masterDataService: MasterDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.error = null;
    
    this.masterDataService.getBrands_home().subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        if (response?.data?.length > 0) {
          // Flatten the array of brand arrays and take first 15 brands
          const brands = response.data
            .flatMap((item: any) => item.brands || [])
            .filter((brand: any) => brand) // Remove any null/undefined brands
            .slice(0, this.maxBrands);
          
          // Set flag for few items
          this.showFewItems = brands.length <= 3;
          
          // Only create circular buffer if we have 6 or more brands
          if (brands.length >= 6) {
            // Create a circular buffer by duplicating the brands array
            this.brands = [...brands, ...brands, ...brands];
            // Set initial position to the middle section
            this.currentSlide = brands.length;
          } else {
            // For fewer than 6 brands, just use the original array
            this.brands = [...brands];
            this.currentSlide = 0;
          }
          
          console.log('Loaded brands:', brands.length, 'with circular buffer');
          
          // Start auto-sliding after brands are loaded
          this.setupAutoSlide();
        } else {
          this.error = 'No brands found';
          console.warn('No brands data received');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.error = 'Failed to load brands. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get maxSlide(): number {
    if (!this.brands || this.brands.length <= this.slidesToShow) return 0;
    return Math.ceil(this.brands.length / this.slidesToShow) - 1;
  }

  get trackTransform(): string {
    if (!this.brands || this.brands.length === 0) return 'translateX(0)';
    
    // Calculate the position with smooth transitions
    const slideWidth = 100 / this.slidesToShow;
    const position = -(this.currentSlide * slideWidth);
    
    return `translateX(${position}%)`;
  }

  getImageUrl(brand: any): string {
    return brand?.blob?.data || 'assets/images/placeholder.png';
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.png';
  }

  nextSlide(): void {
    if (!this.brands || this.brands.length === 0) return;
    
    // Move to the next slide
    this.currentSlide++;
    this.cdr.detectChanges();
    
    // If we reach the end of the duplicated array, reset to the middle section
    if (this.currentSlide >= (this.brands.length / 3) * 2) {
      // Disable transition for the reset
      const track = document.querySelector('.slider-track') as HTMLElement;
      if (track) {
        track.style.transition = 'none';
      }
      
      // Reset to the middle section
      this.currentSlide = this.brands.length / 3;
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
    if (!this.brands || this.brands.length <= this.slidesToShow) return;
    
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.maxSlide;
    this.cdr.detectChanges();
  }

  getDotsArray(): number[] {
    if (this.brands.length <= this.slidesToShow) return [];
    return Array(this.maxSlide + 1).fill(0).map((_, i) => i);
  }

  isActiveSlide(index: number): boolean {
    if (!this.brands || !this.brands.length) return false;
    
    // Calculate the center of the visible slides
    const centerIndex = Math.floor(this.slidesToShow / 2);
    const activeIndex = (this.currentSlide + centerIndex) % (this.brands.length / 3);
    
    // Check if the current index is within the visible range
    return index >= this.currentSlide && index < this.currentSlide + this.slidesToShow;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.cdr.detectChanges();
  }

  private setupAutoSlide(): void {
    this.clearAutoSlide();
    
    if (this.brands && this.brands.length > 0) {
      // Start from the middle of the tripled array
      this.currentSlide = Math.floor(this.brands.length / 3);
      this.cdr.detectChanges();
      
      // Only enable auto-sliding if there are 6 or more unique brands
      const uniqueBrandsCount = this.brands.length / 3; // Since we triple the array for circular effect
      if (uniqueBrandsCount >= 6) {
        // Small delay before starting auto-slide
        setTimeout(() => {
          this.slideInterval = setInterval(() => {
            this.nextSlide();
          }, this.SLIDE_INTERVAL_MS);
        }, 1000);
      }
    }
  }

  private clearAutoSlide(): void {
    if (this.slideInterval) {
      console.log('Clearing auto-slide interval');
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }


}