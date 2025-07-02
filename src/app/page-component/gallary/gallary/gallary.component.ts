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
    { id: 1, src: 'gallary/glP.jpeg', alt: 'Portrait 1', orientation: 'portrait', category: 'portrait' },
    { id: 2, src: 'gallary/glP.jpeg', alt: 'Portrait 2', orientation: 'portrait', category: 'portrait' },
    { id: 3, src: 'gallary/glP.jpeg', alt: 'Portrait 3', orientation: 'portrait', category: 'portrait' },
    { id: 4, src: 'gallary/glP.jpeg', alt: 'Portrait 4', orientation: 'portrait', category: 'portrait' },
    { id: 5, src: 'gallary/glP.jpeg', alt: 'Portrait 5', orientation: 'portrait', category: 'portrait' },
    
    // Landscape Images
    { id: 6, src: 'gallary/glL.jpg', alt: 'Landscape 1', orientation: 'landscape', category: 'landscape' },
    { id: 7, src: 'gallary/glL.jpg', alt: 'Landscape 2', orientation: 'landscape', category: 'landscape' },
    { id: 8, src: 'gallary/glL.jpg', alt: 'Landscape 3', orientation: 'landscape', category: 'landscape' },
    { id: 9, src: 'gallary/glL.jpg', alt: 'Landscape 4', orientation: 'landscape', category: 'landscape' },
    { id: 10, src: 'gallary/glL.jpg', alt: 'Landscape 5', orientation: 'landscape', category: 'landscape' },
    { id: 11, src: 'gallary/glL.jpg', alt: 'Landscape 6', orientation: 'landscape', category: 'landscape' },
    { id: 12, src: 'gallary/glL.jpg', alt: 'Landscape 7', orientation: 'landscape', category: 'landscape' },
    { id: 13, src: 'gallary/glL.jpg', alt: 'Landscape 8', orientation: 'landscape', category: 'landscape' },
    { id: 14, src: 'gallary/glL.jpg', alt: 'Landscape 9', orientation: 'landscape', category: 'landscape' },
    { id: 15, src: 'gallary/glL.jpg', alt: 'Landscape 10', orientation: 'landscape', category: 'landscape' }
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
