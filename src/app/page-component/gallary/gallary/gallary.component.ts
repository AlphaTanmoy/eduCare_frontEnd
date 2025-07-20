import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImageInput {
  src: string;
  alt: string;
  orientation: 'portrait' | 'landscape';
  category: string;
}

interface GalleryImage extends GalleryImageInput {
  id: number;
}

@Component({
  selector: 'app-gallary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallary.component.html',
  styleUrls: ['./gallary.component.css']
})
export class GallaryComponent implements OnInit {
  private imageData: GalleryImageInput[] = [
    // Portrait Images
    { src: 'gallary/Students/P1.jpg', alt: 'Portrait 1', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P2.jpg', alt: 'Portrait 2', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P3.jpg', alt: 'Portrait 3', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P4.jpg', alt: 'Portrait 4', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P5.jpg', alt: 'Portrait 5', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P6.jpg', alt: 'Portrait 6', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P7.jpg', alt: 'Portrait 7', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P8.jpg', alt: 'Portrait 8', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P9.jpg', alt: 'Portrait 9', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P10.jpg', alt: 'Portrait 10', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P11.jpg', alt: 'Portrait 11', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P12.jpg', alt: 'Portrait 12', orientation: 'portrait', category: 'portrait' },
    { src: 'gallary/Students/P13.jpg', alt: 'Portrait 13', orientation: 'portrait', category: 'portrait' },
    
    // Landscape Images
    { src: 'gallary/Students/L1.jpg', alt: 'Landscape 1', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L2.jpg', alt: 'Landscape 2', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L4.jpg', alt: 'Landscape 4', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L5.jpg', alt: 'Landscape 5', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L6.jpg', alt: 'Landscape 6', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L7.jpg', alt: 'Landscape 7', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L8.jpg', alt: 'Landscape 8', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L9.jpg', alt: 'Landscape 9', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L10.jpg', alt: 'Landscape 10', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L11.jpg', alt: 'Landscape 11', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L12.jpg', alt: 'Landscape 12', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L14.jpg', alt: 'Landscape 14', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L15.jpg', alt: 'Landscape 15', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L16.jpg', alt: 'Landscape 16', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L17.jpg', alt: 'Landscape 17', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L18.jpg', alt: 'Landscape 18', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L19.jpg', alt: 'Landscape 19', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L20.jpg', alt: 'Landscape 20', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L21.jpg', alt: 'Landscape 21', orientation: 'landscape', category: 'landscape' },
    { src: 'gallary/Students/L22.jpg', alt: 'Landscape 22', orientation: 'landscape', category: 'landscape' }
  ];

  // Pagination properties
  private readonly ITEMS_PER_PAGE = 12;
  private currentPage = 1;
  private currentFilter = 'all';
  
  // Public properties for template
  activeFilter: string = 'all';
  filteredImages: GalleryImage[] = [];
  displayedImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;
  hasMoreImages = true;
  allImages: GalleryImage[] = [];

  constructor() { }

  ngOnInit(): void {
    // Generate IDs for all images
    this.allImages = this.imageData.map((img, index) => ({
      ...img,
      id: index + 1
    }));
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
