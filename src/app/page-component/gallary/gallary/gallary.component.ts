import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  orientation: 'portrait' | 'landscape';
  category: string;
}

// Helper function to generate more sample images
function generateSampleImages(count: number, startId: number, type: 'portrait' | 'landscape'): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    src: `gallary/gl${type === 'portrait' ? 'P' : 'L'}.${type === 'portrait' ? 'jpeg' : 'jpg'}`,
    alt: `${type === 'portrait' ? 'Portrait' : 'Landscape'} ${startId + i}`,
    orientation: type,
    category: type
  }));
}

@Component({
  selector: 'app-gallary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallary.component.html',
  styleUrls: ['./gallary.component.css']
})
export class GallaryComponent implements OnInit {
  // Generate more sample images (30 total)
  private allImages: GalleryImage[] = [
    ...generateSampleImages(15, 1, 'portrait'),
    ...generateSampleImages(15, 16, 'landscape')
  ];

  // Pagination properties
  private readonly ITEMS_PER_PAGE = 10;
  private currentPage = 1;
  private currentFilter = 'all';
  
  // Public properties for template
  activeFilter: string = 'all';
  filteredImages: GalleryImage[] = [];
  displayedImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;
  hasMoreImages = true;

  ngOnInit(): void {
    this.filterImages('all');
  }

  filterImages(category: string): void {
    this.activeFilter = category;
    this.currentFilter = category;
    this.currentPage = 1;
    
    if (category === 'all') {
      this.filteredImages = [...this.allImages];
    } else {
      this.filteredImages = this.allImages.filter(img => img.category === category);
    }
    
    this.updateDisplayedImages();
  }

  loadMore(): void {
    this.currentPage++;
    this.updateDisplayedImages();
  }

  private updateDisplayedImages(): void {
    const start = 0;
    const end = this.currentPage * this.ITEMS_PER_PAGE;
    
    if (this.currentFilter === 'all') {
      this.displayedImages = this.allImages.slice(0, end);
    } else {
      this.displayedImages = this.filteredImages.slice(0, end);
    }
    
    // Check if there are more images to load
    this.hasMoreImages = this.displayedImages.length < this.filteredImages.length;
  }

  openImageModal(image: GalleryImage): void {
    this.selectedImage = image;
    // @ts-ignore - Bootstrap modal show method
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }
}
