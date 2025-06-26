import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';

export interface FranchiseVerificationResponse {
  status: number;
  responseType: string;
  message: string;
  data: {
    franchiseName: string;
    franchiseRegistrationNumber: string;
    headName: string;
    headPhotoUrl: string;
    contactNumber: number;
    email: string;
    address: string;
    status: string;
    centerType: string;
    approvedOn: string;
  }[];
}

@Component({
  selector: 'app-center-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './center-verify.component.html',
  styleUrls: ['./center-verify.component.css']
})
export class CenterVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  franchiseData: FranchiseVerificationResponse['data'] | null = null;
  errorMessage: string | null = null;
  currentYear: string;
  imageLoaded = false;
  defaultImage = '/images/educare_logo.png';
  private safeUrlCache: SafeResourceUrl | null = null;
  private verifySubscription: Subscription | null = null;
  
  get franchiseYear() { return this.verifyForm.get('franchiseYear'); }
  get franchiseNumber() { return this.verifyForm.get('franchiseNumber'); }

  constructor(
    private fb: FormBuilder,
    private verifyService: VerifyService,
    private sanitizer: DomSanitizer
  ) {
    this.currentYear = new Date().getFullYear().toString();
    this.verifyForm = this.fb.group({
      franchiseYear: [this.currentYear, [
        Validators.required,
        Validators.pattern('^\\d{4}$'),
        Validators.min(2000),
        Validators.max(2099)
      ]],
      franchiseNumber: ['', [
        Validators.required,
        Validators.pattern('^\\d+$'),
        Validators.minLength(1),
        Validators.maxLength(5)
      ]]
    });
  }


  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
  }

  formatFranchiseNumber(year: string, number: string): string {
    const formattedNumber = number.padStart(5, '0');
    return `WB${year}/ECI-CN${formattedNumber}`;
  }

  verifyFranchise(franchiseNumber: string) {
    this.safeUrlCache = null;
    this.isLoading = true;
    this.errorMessage = null;
    
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
    
    this.verifySubscription = this.verifyService.verifyFranchise(franchiseNumber).subscribe({
      next: (response: FranchiseVerificationResponse) => {
        this.franchiseData = response.data;
        if (this.franchiseData?.[0]?.headPhotoUrl) {
          this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(this.franchiseData[0].headPhotoUrl);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Verification failed:', error);
        this.errorMessage = error.error?.message || 'Failed to verify franchise. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.franchiseData = null;
    this.safeUrlCache = null;

    const year = this.verifyForm.get('franchiseYear')?.value;
    const number = this.verifyForm.get('franchiseNumber')?.value;
    const franchiseNumber = this.formatFranchiseNumber(year, number);
    
    this.verifyFranchise(franchiseNumber);
  }

  getSafeUrl(): SafeResourceUrl | null {
    if (!this.franchiseData?.[0]?.headPhotoUrl) {
      return null;
    }
    
    if (this.safeUrlCache) {
      return this.safeUrlCache;
    }
    
    this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.franchiseData[0].headPhotoUrl
    );
    return this.safeUrlCache;
  }
  
  getImageUrl(): string {
    return this.franchiseData?.[0]?.headPhotoUrl || this.defaultImage;
  }
  private extractFileId(url: string): string | null {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      
      const fileIdMatch = urlObj.pathname.match(/\/file\/d\/([^/]+)/);
      if (fileIdMatch?.[1]) {
        return fileIdMatch[1];
      }
      
      return urlObj.searchParams.get('id');
    } catch (e) {
      console.error('Error parsing URL:', e);
      return null;
    }
  }
}
