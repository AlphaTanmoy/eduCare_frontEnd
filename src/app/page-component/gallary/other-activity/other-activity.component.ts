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
    // Achievement
    { id: 1, src: 'gallary/Achievement/L1.jpg', alt: 'Achievement 1', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 2, src: 'gallary/Achievement/L2.jpg', alt: 'Achievement 2', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 3, src: 'gallary/Achievement/L3.jpg', alt: 'Achievement 3', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 4, src: 'gallary/Achievement/L4.jpg', alt: 'Achievement 4', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 5, src: 'gallary/Achievement/L5.jpg', alt: 'Achievement 5', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 6, src: 'gallary/Achievement/L6.jpg', alt: 'Achievement 6', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 7, src: 'gallary/Achievement/L7.jpg', alt: 'Achievement 7', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 8, src: 'gallary/Achievement/L8.jpg', alt: 'Achievement 8', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 9, src: 'gallary/Achievement/L9.jpg', alt: 'Achievement 9', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 10, src: 'gallary/Achievement/L10.jpg', alt: 'Achievement 10', orientation: 'landscape', category: 'activity', activityType: 'Achievement' },
    { id: 11, src: 'gallary/Achievement/P1.jpg', alt: 'Achievement 11', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 12, src: 'gallary/Achievement/P2.jpg', alt: 'Achievement 12', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 13, src: 'gallary/Achievement/P3.jpg', alt: 'Achievement 13', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 14, src: 'gallary/Achievement/P4.jpg', alt: 'Achievement 14', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 15, src: 'gallary/Achievement/P5.jpg', alt: 'Achievement 15', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 16, src: 'gallary/Achievement/P6.jpg', alt: 'Achievement 16', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 17, src: 'gallary/Achievement/P7.jpg', alt: 'Achievement 17', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 18, src: 'gallary/Achievement/P8.jpg', alt: 'Achievement 18', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },
    { id: 19, src: 'gallary/Achievement/P9.jpg', alt: 'Achievement 19', orientation: 'portrait', category: 'activity', activityType: 'Achievement' },

    // Activity
    { id: 20, src: 'gallary/Activity/L1.jpg', alt: 'Activity 1', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 21, src: 'gallary/Activity/L2.jpg', alt: 'Activity 2', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 22, src: 'gallary/Activity/L3.jpg', alt: 'Activity 3', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 23, src: 'gallary/Activity/L4.jpg', alt: 'Activity 4', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 24, src: 'gallary/Activity/L5.jpg', alt: 'Activity 5', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 25, src: 'gallary/Activity/L6.jpg', alt: 'Activity 6', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 26, src: 'gallary/Activity/L7.jpg', alt: 'Activity 7', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 27, src: 'gallary/Activity/L8.jpg', alt: 'Activity 8', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 28, src: 'gallary/Activity/L9.jpg', alt: 'Activity 9', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 29, src: 'gallary/Activity/L10.jpg', alt: 'Activity 10', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 30, src: 'gallary/Activity/L11.jpg', alt: 'Activity 11', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 31, src: 'gallary/Activity/L12.jpg', alt: 'Activity 12', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 32, src: 'gallary/Activity/L13.jpg', alt: 'Activity 13', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 33, src: 'gallary/Activity/L14.jpg', alt: 'Activity 14', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 34, src: 'gallary/Activity/L15.jpg', alt: 'Activity 15', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 35, src: 'gallary/Activity/L16.jpg', alt: 'Activity 16', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 36, src: 'gallary/Activity/L17.jpg', alt: 'Activity 17', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 37, src: 'gallary/Activity/L18.jpg', alt: 'Activity 18', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 38, src: 'gallary/Activity/L19.jpg', alt: 'Activity 19', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 39, src: 'gallary/Activity/L20.jpg', alt: 'Activity 20', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 40, src: 'gallary/Activity/L21.jpg', alt: 'Activity 21', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 41, src: 'gallary/Activity/P1.jpg', alt: 'Activity 22', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 42, src: 'gallary/Activity/P2.jpg', alt: 'Activity 23', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 41, src: 'gallary/Activity/P3.jpg', alt: 'Activity 24', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 42, src: 'gallary/Activity/P4.jpg', alt: 'Activity 25', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 41, src: 'gallary/Activity/P5.jpg', alt: 'Activity 26', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 42, src: 'gallary/Activity/P6.jpg', alt: 'Activity 27', orientation: 'portrait', category: 'activity', activityType: 'Activity' },
    { id: 42, src: 'gallary/Activity/P7.jpg', alt: 'Activity 28', orientation: 'portrait', category: 'activity', activityType: 'Activity' },

    // CRS FREE GOVT COURSE
    { id: 43, src: 'gallary/CSR_Free_Govt_Course/L1.jpg', alt: 'CRS Free Govt Course 1', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 44, src: 'gallary/CSR_Free_Govt_Course/L2.jpg', alt: 'CRS Free Govt Course 2', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 45, src: 'gallary/CSR_Free_Govt_Course/L3.jpg', alt: 'CRS Free Govt Course 3', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 46, src: 'gallary/CSR_Free_Govt_Course/L4.jpg', alt: 'CRS Free Govt Course 4', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 47, src: 'gallary/CSR_Free_Govt_Course/L5.jpg', alt: 'CRS Free Govt Course 5', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 48, src: 'gallary/CSR_Free_Govt_Course/L1.jpg', alt: 'CRS Free Govt Course 1', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 49, src: 'gallary/CSR_Free_Govt_Course/L2.jpg', alt: 'CRS Free Govt Course 2', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 50, src: 'gallary/CSR_Free_Govt_Course/L3.jpg', alt: 'CRS Free Govt Course 3', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 51, src: 'gallary/CSR_Free_Govt_Course/L4.jpg', alt: 'CRS Free Govt Course 4', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 52, src: 'gallary/CSR_Free_Govt_Course/L5.jpg', alt: 'CRS Free Govt Course 5', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 53, src: 'gallary/CSR_Free_Govt_Course/L1.jpg', alt: 'CRS Free Govt Course 1', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 54, src: 'gallary/CSR_Free_Govt_Course/L2.jpg', alt: 'CRS Free Govt Course 2', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 55, src: 'gallary/CSR_Free_Govt_Course/L3.jpg', alt: 'CRS Free Govt Course 3', orientation: 'landscape', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 56, src: 'gallary/CSR_Free_Govt_Course/P1.jpg', alt: 'CRS Free Govt Course 6', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 57, src: 'gallary/CSR_Free_Govt_Course/P2.jpg', alt: 'CRS Free Govt Course 7', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 58, src: 'gallary/CSR_Free_Govt_Course/P3.jpeg', alt: 'CRS Free Govt Course 8', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 56, src: 'gallary/CSR_Free_Govt_Course/P4.jpeg', alt: 'CRS Free Govt Course 6', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 57, src: 'gallary/CSR_Free_Govt_Course/P5.jpeg', alt: 'CRS Free Govt Course 7', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 58, src: 'gallary/CSR_Free_Govt_Course/P6.jpeg', alt: 'CRS Free Govt Course 8', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 57, src: 'gallary/CSR_Free_Govt_Course/P7.jpg', alt: 'CRS Free Govt Course 7', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },
    { id: 58, src: 'gallary/CSR_Free_Govt_Course/P8.jpg', alt: 'CRS Free Govt Course 8', orientation: 'portrait', category: 'activity', activityType: 'CRS Free Govt Course' },

    // Interview Session
    { id: 59, src: 'gallary/Interview_session/L1.jpg', alt: 'Interview Session 1', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 60, src: 'gallary/Interview_session/L2.jpg', alt: 'Interview Session 2', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 61, src: 'gallary/Interview_session/L3.jpg', alt: 'Interview Session 3', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 62, src: 'gallary/Interview_session/L4.jpg', alt: 'Interview Session 4', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 63, src: 'gallary/Interview_session/L5.jpg', alt: 'Interview Session 5', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 64, src: 'gallary/Interview_session/L6.jpg', alt: 'Interview Session 6', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 65, src: 'gallary/Interview_session/L7.jpg', alt: 'Interview Session 7', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 66, src: 'gallary/Interview_session/L8.jpg', alt: 'Interview Session 8', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 67, src: 'gallary/Interview_session/L9.jpeg', alt: 'Interview Session 9', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 68, src: 'gallary/Interview_session/L10.jpeg', alt: 'Interview Session 10', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 69, src: 'gallary/Interview_session/L11.jpeg', alt: 'Interview Session 11', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 70, src: 'gallary/Interview_session/L12.jpeg', alt: 'Interview Session 12', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 71, src: 'gallary/Interview_session/L13.jpeg', alt: 'Interview Session 13', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 72, src: 'gallary/Interview_session/L14.jpeg', alt: 'Interview Session 14', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 73, src: 'gallary/Interview_session/L15.jpeg', alt: 'Interview Session 15', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 74, src: 'gallary/Interview_session/L16.jpeg', alt: 'Interview Session 16', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 75, src: 'gallary/Interview_session/L17.jpeg', alt: 'Interview Session 17', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 76, src: 'gallary/Interview_session/L18.jpeg', alt: 'Interview Session 18', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 77, src: 'gallary/Interview_session/L19.jpeg', alt: 'Interview Session 19', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 78, src: 'gallary/Interview_session/L20.jpeg', alt: 'Interview Session 20', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 79, src: 'gallary/Interview_session/L21.jpeg', alt: 'Interview Session 21', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 80, src: 'gallary/Interview_session/L22.jpeg', alt: 'Interview Session 22', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 81, src: 'gallary/Interview_session/L23.jpeg', alt: 'Interview Session 23', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 82, src: 'gallary/Interview_session/L24.jpeg', alt: 'Interview Session 24', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 83, src: 'gallary/Interview_session/L25.jpeg', alt: 'Interview Session 25', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 84, src: 'gallary/Interview_session/L26.jpeg', alt: 'Interview Session 26', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 85, src: 'gallary/Interview_session/L27.jpeg', alt: 'Interview Session 27', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 86, src: 'gallary/Interview_session/L28.jpeg', alt: 'Interview Session 28', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 87, src: 'gallary/Interview_session/L29.jpeg', alt: 'Interview Session 29', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 88, src: 'gallary/Interview_session/L30.jpeg', alt: 'Interview Session 30', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 89, src: 'gallary/Interview_session/L31.jpeg', alt: 'Interview Session 31', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 90, src: 'gallary/Interview_session/L32.jpeg', alt: 'Interview Session 32', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 91, src: 'gallary/Interview_session/L33.jpeg', alt: 'Interview Session 33', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 92, src: 'gallary/Interview_session/L34.jpeg', alt: 'Interview Session 34', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 93, src: 'gallary/Interview_session/L35.jpeg', alt: 'Interview Session 35', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },
    { id: 94, src: 'gallary/Interview_session/L36.jpeg', alt: 'Interview Session 36', orientation: 'landscape', category: 'activity', activityType: 'Interview Session' },

    // Placement
    { id: 95, src: 'gallary/Placement/L1.jpeg', alt: 'Placement 1', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 96, src: 'gallary/Placement/L2.jpeg', alt: 'Placement 2', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 97, src: 'gallary/Placement/L3.jpeg', alt: 'Placement 3', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 98, src: 'gallary/Placement/L4.jpeg', alt: 'Placement 4', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 99, src: 'gallary/Placement/L5.jpeg', alt: 'Placement 5', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 100, src: 'gallary/Placement/L6.jpeg', alt: 'Placement 6', orientation: 'landscape', category: 'activity', activityType: 'Placement' },
    { id: 101, src: 'gallary/Placement/L7.jpeg', alt: 'Placement 7', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 102, src: 'gallary/Placement/L8.jpeg', alt: 'Placement 8', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 103, src: 'gallary/Placement/L9.jpeg', alt: 'Placement 9', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 104, src: 'gallary/Placement/L10.jpeg', alt: 'Placement 10', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 105, src: 'gallary/Placement/P1.jpeg', alt: 'Placement 11', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 106, src: 'gallary/Placement/P2.jpeg', alt: 'Placement 12', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 107, src: 'gallary/Placement/P3.jpeg', alt: 'Placement 13', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 108, src: 'gallary/Placement/P4.jpeg', alt: 'Placement 14', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 109, src: 'gallary/Placement/P5.jpeg', alt: 'Placement 15', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 110, src: 'gallary/Placement/P6.jpeg', alt: 'Placement 16', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 115, src: 'gallary/Placement/P11.jpeg', alt: 'Placement 21', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 116, src: 'gallary/Placement/P12.jpeg', alt: 'Placement 22', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 117, src: 'gallary/Placement/P13.jpeg', alt: 'Placement 23', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 118, src: 'gallary/Placement/P14.jpeg', alt: 'Placement 24', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 119, src: 'gallary/Placement/P15.jpeg', alt: 'Placement 25', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 120, src: 'gallary/Placement/P16.jpeg', alt: 'Placement 26', orientation: 'portrait', category: 'activity', activityType: 'Placement' },
    { id: 121, src: 'gallary/Placement/P17.jpeg', alt: 'Placement 27', orientation: 'portrait', category: 'activity', activityType: 'Placement' },

    // Tour
    { id: 122, src: 'gallary/Tour/L1.jpg', alt: 'Tour 1', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 123, src: 'gallary/Tour/L2.jpg', alt: 'Tour 2', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 124, src: 'gallary/Tour/L3.jpg', alt: 'Tour 3', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 125, src: 'gallary/Tour/L4.jpg', alt: 'Tour 4', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 126, src: 'gallary/Tour/L5.jpg', alt: 'Tour 5', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 127, src: 'gallary/Tour/L6.jpg', alt: 'Tour 6', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 128, src: 'gallary/Tour/L7.jpg', alt: 'Tour 7', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 129, src: 'gallary/Tour/L8.jpg', alt: 'Tour 8', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 130, src: 'gallary/Tour/L9.jpg', alt: 'Tour 9', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 131, src: 'gallary/Tour/L10.jpg', alt: 'Tour 10', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 132, src: 'gallary/Tour/L11.jpg', alt: 'Tour 11', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 133, src: 'gallary/Tour/L12.jpeg', alt: 'Tour 12', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 134, src: 'gallary/Tour/L13.jpeg', alt: 'Tour 13', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 135, src: 'gallary/Tour/L14.jpeg', alt: 'Tour 14', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 136, src: 'gallary/Tour/L15.jpeg', alt: 'Tour 15', orientation: 'landscape', category: 'activity', activityType: 'Tour' },
    { id: 137, src: 'gallary/Tour/L16.jpeg', alt: 'Tour 16', orientation: 'landscape', category: 'activity', activityType: 'Tour' },

  ];

  // Pagination properties
  private readonly ITEMS_PER_PAGE = 10;
  private currentPage = 1;
  private currentFilter = 'All';

  // Public properties for template
  activeFilter: string = 'All';
  filteredImages: GalleryImage[] = [];
  displayedImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;
  hasMoreImages = true;
  activityTypes = ['All', 'Achievement', 'Activity', 'CRS Free Govt Course', 'Interview Session', 'Placement', 'Tour'];

  ngOnInit(): void {
    this.filterImages('All');
  }

  filterImages(category: string): void {
    this.activeFilter = category;
    this.currentFilter = category;
    this.currentPage = 1;

    if (category === 'All') {
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

    if (this.currentFilter === 'All') {
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
