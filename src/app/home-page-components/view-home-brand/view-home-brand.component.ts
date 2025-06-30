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
          // Flatten the array of brand arrays
          this.brands = response.data
            .flatMap((item: any) => item.brands || [])
            .filter((brand: any) => brand) // Remove any null/undefined brands
            .slice(0, this.maxBrands);
          
          console.log('Loaded brands:', this.brands.length);
          
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
    let position = -(this.currentSlide * slideWidth);
    
    // Add a small offset to ensure smooth transition when looping
    if (this.currentSlide === 0 && this.brands.length > 0) {
      position = 0;
    }
    
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
    this.currentSlide = (this.currentSlide + 1) % this.brands.length;
    this.cdr.detectChanges();
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

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.cdr.detectChanges();
  }

  private setupAutoSlide(): void {
    this.clearAutoSlide();
    
    // Always set up auto-slide if we have brands
    if (this.brands && this.brands.length > 0) {
      console.log('Setting up circular auto-slide with', this.brands.length, 'brands');
      
      // Initial position - start from the first slide
      this.currentSlide = 0;
      this.cdr.detectChanges();
      
      // Set up interval for auto-sliding
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, this.SLIDE_INTERVAL_MS);
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