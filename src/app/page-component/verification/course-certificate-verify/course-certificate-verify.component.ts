import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';

export interface CertificateVerificationResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: {
    studentName: string;
    certificateNumber: string;
    franchiseName: string;
    issueDate: string;
    certificatePhotoUrl: string;
    status: string;
  }[];
}

@Component({
  selector: 'app-course-certificate-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './course-certificate-verify.component.html',
  styleUrls: ['./course-certificate-verify.component.css']
})
export class CourseCertificateVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  certificateData: CertificateVerificationResponse['data'] | null = null;
  errorMessage: string | null = null;
  private safeUrlCache: SafeResourceUrl | null = null;
  private verifySubscription: Subscription | null = null;
  defaultImage = '/images/educare_logo.png';
  
  get certificateNumber() { return this.verifyForm.get('certificateNumber'); }

  constructor(
    private fb: FormBuilder,
    private verifyService: VerifyService,
    private sanitizer: DomSanitizer
  ) {
    this.verifyForm = this.fb.group({
      certificateNumber: ['', [
        Validators.required,
        Validators.pattern('^\\d{4}-\\d{5}$'),
        Validators.minLength(10),
        Validators.maxLength(10)
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

  verifyCertificate(certificateNumber: string) {
    this.safeUrlCache = null;
    this.isLoading = true;
    this.errorMessage = null;
    
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
    
    this.verifySubscription = this.verifyService.verifyCertificate(certificateNumber).subscribe({
      next: (response: CertificateVerificationResponse) => {
        this.certificateData = response.data;
        if (this.certificateData?.[0]?.certificatePhotoUrl) {
          this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.certificateData[0].certificatePhotoUrl
          );
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Verification failed:', error);
        this.errorMessage = error.error?.message || 'Failed to verify certificate. Please try again.';
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
    this.certificateData = null;
    this.safeUrlCache = null;

    const certificateNumber = this.verifyForm.get('certificateNumber')?.value;
    this.verifyCertificate(certificateNumber);
  }

  getSafeUrl(): SafeResourceUrl | null {
    if (!this.certificateData?.[0]?.certificatePhotoUrl) {
      return null;
    }
    
    if (this.safeUrlCache) {
      return this.safeUrlCache;
    }
    
    this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.certificateData[0].certificatePhotoUrl
    );
    return this.safeUrlCache;
  }
  
  getImageUrl(): string {
    return this.certificateData?.[0]?.certificatePhotoUrl || this.defaultImage;
  }
}
