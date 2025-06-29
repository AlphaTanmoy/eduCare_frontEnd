import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ytlinks-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ytlinks-add.component.html',
  styleUrls: ['./ytlinks-add.component.css']
})
export class YtlinksAddComponent implements OnInit {
  youtubeForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.youtubeForm = this.fb.group({
      link_heading: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      yt_link: ['', [Validators.required, this.youtubeUrlValidator]]
    });
  }

  ngOnInit(): void {}

  getYouTubeEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    const videoId = this.getYouTubeVideoId(url);
    if (!videoId) return '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private getYouTubeVideoId(url: string): string {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : '';
  }

  // Custom validator for YouTube URLs
  private youtubeUrlValidator(control: { value: string }) {
    if (!control.value) {
      return null;
    }
    
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regExp.test(control.value) ? null : { invalidYoutubeUrl: true };
  }

  onSubmit(): void {
    if (this.youtubeForm.invalid) {
      this.youtubeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { link_heading, yt_link } = this.youtubeForm.value;

    this.masterDataService.createYouTubeLink(link_heading, yt_link).subscribe({
      next: () => {
        this.toastr.success('YouTube link added successfully', 'Success');
        this.router.navigate(['/control-panel/manage-youtube-link']);
      },
      error: (error: any) => {
        console.error('Error adding YouTube link:', error);
        const errorMessage = error.error?.message || 'Failed to add YouTube link. Please try again.';
        this.error = errorMessage;
        this.toastr.error(errorMessage, 'Error');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.youtubeForm.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.router.navigate(['/control-panel/manage-youtube-link']);
      }
    } else {
      this.router.navigate(['/control-panel/manage-youtube-link']);
    }
  }
}
