import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Services
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

interface YouTubeLink {
  _id: string;
  yt_link_code: string;
  link_heading: string;
  yt_link: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  __v?: number;
  id?: string;
}

@Component({
  selector: 'app-ytlinks-management',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './ytlinks-management.component.html',
  styleUrls: ['./ytlinks-management.component.css'],
  host: { 'class': 'd-block' }
})
export class YtlinksManagementComponent implements OnInit {
  youtubeLinks: YouTubeLink[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery: string = '';
  lastUpdated: Date | null = null;

  constructor(
    private masterDataService: MasterDataService,
    private router: Router
  ) {}

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    console.log('Initializing YtlinksManagementComponent');
    console.log('User role should be MASTER to access this page');
    this.loadYouTubeLinks();
    this.bootstrapElements = loadBootstrap();
    this.removeBackdropOverlays();
  }

  private removeBackdropOverlays(): void {
    // Check after a short delay to ensure the DOM is fully loaded
    setTimeout(() => {
      // Remove any Material dialog backdrops
      const materialBackdrops = document.querySelectorAll('.cdk-overlay-backdrop, .cdk-overlay-dark-backdrop, .cdk-overlay-container');
      materialBackdrops.forEach(backdrop => {
        console.log('Removing backdrop:', backdrop);
        backdrop.remove();
      });

      // Remove any Bootstrap modals
      const bootstrapModals = document.querySelectorAll('.modal-backdrop');
      bootstrapModals.forEach(modal => {
        console.log('Removing modal backdrop:', modal);
        modal.remove();
      });

      // Remove any overlay containers
      const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
      overlayContainers.forEach(container => {
        console.log('Removing overlay container:', container);
        container.remove();
      });

      // Remove any body classes that might be causing the darkening
      document.body.classList.remove('cdk-global-scrollblock', 'modal-open');
    }, 100);
  }

  loadYouTubeLinks(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Loading YouTube links...');

    this.masterDataService.getYouTubeLinks().subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response?.data?.[0]?.links) {
          this.youtubeLinks = response.data[0].links;
          this.lastUpdated = new Date();
          console.log('Successfully loaded', this.youtubeLinks.length, 'YouTube links');
        } else {
          this.error = 'No data received from server';
          console.error('Invalid response format:', response);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading YouTube links:', err);
        this.error = 'Failed to load YouTube links. Please try again later.';
        this.isLoading = false;
        
        // If it's a 401/403, the user might not have permission
        if (err.status === 401 || err.status === 403) {
          this.error = 'You do not have permission to access this resource';
        }
      }
    });
  }

  getActiveLinksCount(): number {
    return this.youtubeLinks?.length || 0;
  }

  // Filter YouTube links based on search query
  get filteredLinks(): YouTubeLink[] {
    if (!this.searchQuery?.trim()) {
      return this.youtubeLinks || [];
    }
    const query = this.searchQuery.toLowerCase().trim();
    return (this.youtubeLinks || []).filter(link => {
      const heading = link?.link_heading?.toLowerCase() || '';
      const url = link?.yt_link?.toLowerCase() || '';
      return heading.includes(query) || url.includes(query);
    });
  }

  getYouTubeEmbedUrl(url: string | undefined | null): string {
    if (!url) return '';
    try {
      const videoId = this.getYouTubeVideoId(url);
      if (!videoId) return '';
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    } catch (error) {
      console.error('Error generating YouTube embed URL:', error);
      return '';
    }
  }

  getYouTubeVideoId(url: string | undefined | null): string {
    if (!url) return '';
    try {
      // Handle youtu.be/ID format
      const shortUrlMatch = url.match(/youtu\.be\/([^#&?\/]+)/);
      if (shortUrlMatch?.[1]) {
        return shortUrlMatch[1].split('?')[0]; // Remove any query parameters
      }

      // Handle youtube.com/watch?v=ID format
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
          return urlObj.searchParams.get('v') || '';
        }
      } catch (e) {
        console.warn('Error parsing URL:', url);
      }

      // Handle youtube.com/live/ID format
      const liveMatch = url.match(/youtube\.com\/live\/([^#&?\/]+)/);
      if (liveMatch?.[1]) {
        return liveMatch[1].split('?')[0]; // Remove any query parameters
      }

      // Handle other cases with regex as fallback
      const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|youtube\.com\/live\/)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = match?.[1] || '';
      return videoId.length >= 11 ? videoId.substring(0, 11) : '';
    } catch (error) {
      console.error('Error extracting YouTube video ID from URL:', url, error);
      return '';
    }
  }

  // Delete YouTube link
  confirmDelete(link: YouTubeLink): void {
    const heading = link?.link_heading || 'this link';
    if (confirm(`Are you sure you want to delete "${heading}"? This action cannot be undone.`)) {
      this.deleteLink(link._id);
    }
  }

  deleteLink(linkId: string): void {
    if (confirm('Are you sure you want to delete this YouTube link?')) {
      this.isLoading = true;
      this.masterDataService.deleteYouTubeLink(linkId).subscribe({
        next: (response: any) => {
          if (response?.status === 'success') {
            console.log('YouTube link deleted successfully');
            this.loadYouTubeLinks();
          } else {
            this.error = response?.message || 'Failed to delete YouTube link';
            console.error('Delete failed:', response);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error deleting YouTube link:', error);
          this.error = 'Failed to delete YouTube link. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
