import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  orientation: 'portrait' | 'landscape';
  category: string;
}

@Component({
  selector: 'app-gallary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallary.component.html',
  styleUrls: ['./gallary.component.css']
})
export class GallaryComponent implements OnInit {
  private allImages: GalleryImage[] = [
    // Portrait Images
    { id: 1, src: 'gallary/Students/P1.jpg', alt: 'Portrait 1', orientation: 'portrait', category: 'portrait' },
    { id: 2, src: 'gallary/Students/P2.jpg', alt: 'Portrait 2', orientation: 'portrait', category: 'portrait' },
    { id: 3, src: 'gallary/Students/P3.jpg', alt: 'Portrait 3', orientation: 'portrait', category: 'portrait' },
    { id: 4, src: 'gallary/Students/P4.jpg', alt: 'Portrait 4', orientation: 'portrait', category: 'portrait' },
    { id: 5, src: 'gallary/Students/P5.jpg', alt: 'Portrait 5', orientation: 'portrait', category: 'portrait' },
    { id: 6, src: 'gallary/Students/P6.jpg', alt: 'Portrait 1', orientation: 'portrait', category: 'portrait' },
    { id: 7, src: 'gallary/Students/P7.jpg', alt: 'Portrait 2', orientation: 'portrait', category: 'portrait' },
    { id: 8, src: 'gallary/Students/P8.jpg', alt: 'Portrait 3', orientation: 'portrait', category: 'portrait' },
    { id: 9, src: 'gallary/Students/P9.jpg', alt: 'Portrait 4', orientation: 'portrait', category: 'portrait' },
    { id: 10, src: 'gallary/Students/P10.jpg', alt: 'Portrait 5', orientation: 'portrait', category: 'portrait' },
    { id: 11, src: 'gallary/Students/P11.jpg', alt: 'Portrait 1', orientation: 'portrait', category: 'portrait' },
    { id: 12, src: 'gallary/Students/P12.jpg', alt: 'Portrait 2', orientation: 'portrait', category: 'portrait' },
    { id: 13, src: 'gallary/Students/P13.jpg', alt: 'Portrait 3', orientation: 'portrait', category: 'portrait' },
    
    // Landscape Images
    { id: 14, src: 'gallary/Students/L1.jpg', alt: 'Landscape 1', orientation: 'landscape', category: 'landscape' },
    { id: 15, src: 'gallary/Students/L2.jpg', alt: 'Landscape 2', orientation: 'landscape', category: 'landscape' },
    { id: 16, src: 'gallary/Students/L4.jpg', alt: 'Landscape 4', orientation: 'landscape', category: 'landscape' },
    { id: 17, src: 'gallary/Students/L5.jpg', alt: 'Landscape 5', orientation: 'landscape', category: 'landscape' },
    { id: 18, src: 'gallary/Students/L6.jpg', alt: 'Landscape 6', orientation: 'landscape', category: 'landscape' },
    { id: 19, src: 'gallary/Students/L7.jpg', alt: 'Landscape 7', orientation: 'landscape', category: 'landscape' },
    { id: 20, src: 'gallary/Students/L8.jpg', alt: 'Landscape 8', orientation: 'landscape', category: 'landscape' },
    { id: 21, src: 'gallary/Students/L9.jpg', alt: 'Landscape 9', orientation: 'landscape', category: 'landscape' },
    { id: 22, src: 'gallary/Students/L10.jpg', alt: 'Landscape 10', orientation: 'landscape', category: 'landscape' },
    { id: 23, src: 'gallary/Students/L11.jpg', alt: 'Landscape 1', orientation: 'landscape', category: 'landscape' },
    { id: 24, src: 'gallary/Students/L12.jpg', alt: 'Landscape 2', orientation: 'landscape', category: 'landscape' },
    { id: 25, src: 'gallary/Students/L13.jpg', alt: 'Landscape 3', orientation: 'landscape', category: 'landscape' },
    { id: 26, src: 'gallary/Students/L14.jpg', alt: 'Landscape 4', orientation: 'landscape', category: 'landscape' },
    { id: 27, src: 'gallary/Students/L15.jpg', alt: 'Landscape 5', orientation: 'landscape', category: 'landscape' },
    { id: 28, src: 'gallary/Students/L16.jpg', alt: 'Landscape 6', orientation: 'landscape', category: 'landscape' },
    { id: 29, src: 'gallary/Students/L17.jpg', alt: 'Landscape 7', orientation: 'landscape', category: 'landscape' },
    { id: 30, src: 'gallary/Students/L18.jpg', alt: 'Landscape 8', orientation: 'landscape', category: 'landscape' },
    { id: 31, src: 'gallary/Students/L19.jpg', alt: 'Landscape 9', orientation: 'landscape', category: 'landscape' },
    { id: 32, src: 'gallary/Students/L20.jpg', alt: 'Landscape 10', orientation: 'landscape', category: 'landscape' },
    { id: 33, src: 'gallary/Students/L21.jpg', alt: 'Landscape 1', orientation: 'landscape', category: 'landscape' },
    { id: 34, src: 'gallary/Students/L22.jpg', alt: 'Landscape 2', orientation: 'landscape', category: 'landscape' }
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
