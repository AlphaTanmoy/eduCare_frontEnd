import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  orientation: 'portrait' | 'landscape';
  category: string;
  activityType: string;
}

@Component({
  selector: 'app-other-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './other-activity.component.html',
  styleUrls: ['./other-activity.component.css']
})
export class OtherActivityComponent implements OnInit {
  // Activity images
  private allImages: GalleryImage[] = [
    // Sports Activities (Landscape)
    { id: 1, src: 'activity/cha.png', alt: 'Sports Activity 1', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 2, src: 'activity/cha.png', alt: 'Sports Activity 2', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 3, src: 'activity/cha.png', alt: 'Sports Activity 3', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 4, src: 'activity/picnic.jpeg', alt: 'Sports Activity 4', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 5, src: 'activity/picnic.jpeg', alt: 'Sports Activity 5', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 6, src: 'activity/pt.png', alt: 'Sports Activity 6', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 7, src: 'activity/pt.png', alt: 'Sports Activity 7', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    { id: 8, src: 'activity/pt.png', alt: 'Sports Activity 8', orientation: 'landscape', category: 'activity', activityType: 'sports' },
    
    // Cultural Activities (Portrait)
    { id: 9, src: 'activity/pt.png', alt: 'Cultural Activity 1', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 10, src: 'activity/pt.png', alt: 'Cultural Activity 2', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 11, src: 'activity/pt.png', alt: 'Cultural Activity 3', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 12, src: 'activity/pt.png', alt: 'Cultural Activity 4', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 13, src: 'activity/pt.png', alt: 'Cultural Activity 5', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 14, src: 'activity/pt.png', alt: 'Cultural Activity 6', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 15, src: 'activity/cha.png', alt: 'Cultural Activity 7', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    { id: 16, src: 'activity/cha.png', alt: 'Cultural Activity 8', orientation: 'portrait', category: 'activity', activityType: 'cultural' },
    
    // Workshop Activities (Landscape)
    { id: 17, src: 'activity/pt.png', alt: 'Workshop Activity 1', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 18, src: 'activity/pt.png', alt: 'Workshop Activity 2', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 19, src: 'activity/pt.png', alt: 'Workshop Activity 3', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 20, src: 'activity/picnic.jpeg', alt: 'Workshop Activity 4', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 21, src: 'activity/picnic.jpeg', alt: 'Workshop Activity 5', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 22, src: 'activity/cha.png', alt: 'Workshop Activity 6', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 23, src: 'activity/picnic.png', alt: 'Workshop Activity 7', orientation: 'landscape', category: 'activity', activityType: 'workshop' },
    { id: 24, src: 'activity/cha.png', alt: 'Workshop Activity 8', orientation: 'landscape', category: 'activity', activityType: 'workshop' }
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
  activityTypes = ['all', 'sports', 'cultural', 'workshop'];

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
      this.filteredImages = this.allImages.filter(img => img.activityType === category);
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
      this.displayedImages = this.filteredImages.slice(0, end);
    } else {
      this.displayedImages = this.filteredImages.slice(0, end);
    }
    
    // Check if there are more images to load
    this.hasMoreImages = this.displayedImages.length < this.filteredImages.length;
  }

  openImageModal(image: GalleryImage): void {
    this.selectedImage = image;
    // @ts-ignore - Bootstrap modal show method
    const modal = new bootstrap.Modal(document.getElementById('activityImageModal'));
    modal.show();
  }
}
