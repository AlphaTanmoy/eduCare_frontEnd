import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';
import { HumanVerificationComponent } from '../../../common-component/human-verification/human-verification.component';

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
  imports: [ReactiveFormsModule, CommonModule, HumanVerificationComponent],
  templateUrl: './center-verify.component.html',
  styleUrls: ['./center-verify.component.css']
})
export class CenterVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  showVerification = false;
  franchiseData: FranchiseVerificationResponse['data'] | null = null;
  errorMessage: string | null = null;
  currentYear: string;
  imageLoaded = false;
  defaultImage = '/images/educare_logo.png';
  private safeUrlCache: SafeResourceUrl | null = null;
  private verifySubscription: Subscription | null = null;
  private pendingVerificationData: { franchiseYear: string; franchiseNumber: string } | null = null;
  
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



  verifyFranchise() {
    this.pendingVerificationData = {
      franchiseYear: this.verifyForm.get('franchiseYear')?.value,
      franchiseNumber: this.verifyForm.get('franchiseNumber')?.value
    };
    this.showVerification = true;
  }

  onVerificationComplete() {
    this.showVerification = false;
    if (!this.pendingVerificationData) return;

    this.safeUrlCache = null;
    this.isLoading = true;
    this.errorMessage = null;
    
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
    
    const { franchiseYear, franchiseNumber } = this.pendingVerificationData;
    const formattedNumber = `WB${franchiseYear}/ECI-CN${franchiseNumber.padStart(5, '0')}`;
    this.verifySubscription = this.verifyService.verifyFranchise(formattedNumber).subscribe({
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
    this.verifyFranchise();
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
