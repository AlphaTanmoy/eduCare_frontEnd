import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataService } from '../../service/master-data/master-data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface YouTubeLink {
  _id: string;
  yt_link_code: string;
  link_heading: string;
  yt_link: string;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface YouTubeLinksResponse {
  links: YouTubeLink[];
  total: number;
  page: number;
  pages: number;
}

@Component({
  selector: 'app-view-yt-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-yt-link.component.html',
  styleUrls: ['./view-yt-link.component.css']
})
export class ViewYtLinkComponent implements OnInit {
  videoData: YouTubeLink | null = null;
  loading = true;
  error: string | null = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(
    private masterDataService: MasterDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadYouTubeVideo();
  }

  private loadYouTubeVideo(): void {
    this.loading = true;
    this.masterDataService.getYouTubeLinks_home().subscribe({
      next: (response: { data?: Array<YouTubeLinksResponse> }) => {
        try {
          // Check if we have data and the first item has a links array with at least one video
          const firstResponse = response?.data?.[0];
          if (firstResponse?.links?.[0]) {
            const video = firstResponse.links[0];
            this.videoData = video;
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.getEmbedUrl(video.yt_link)
            );
          } else {
            this.error = 'No video available at the moment.';
          }
        } catch (err) {
          console.error('Error processing video data:', err);
          this.error = 'Error processing video data. Please try again.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading YouTube video:', err);
        this.error = 'Failed to load video. Please try again later.';
        this.loading = false;
      }
    });
  }

  private getEmbedUrl(url: string): string {
    if (!url) return '';
    // Convert YouTube URL to embed URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2]?.length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0` : '';
  }
}
