import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';
import { HumanVerificationComponent } from '../../../common-component/human-verification/human-verification.component';

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
  imports: [ReactiveFormsModule, CommonModule, HumanVerificationComponent],
  templateUrl: './course-certificate-verify.component.html',
  styleUrls: ['./course-certificate-verify.component.css']
})
export class CourseCertificateVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  showVerification = false;
  certificateData: CertificateVerificationResponse['data'] | null = null;
  errorMessage: string | null = null;
  private safeUrlCache: SafeResourceUrl | null = null;
  private verifySubscription: Subscription | null = null;
  defaultImage = '/images/educare_logo.png';
  private pendingVerificationData: { year: string; number: string } | null = null;
  
  get year() { return this.verifyForm.get('year'); }
  get number() { return this.verifyForm.get('number'); }

  constructor(
    private fb: FormBuilder,
    private verifyService: VerifyService,
    private sanitizer: DomSanitizer
  ) {
    this.verifyForm = this.fb.group({
      year: [new Date().getFullYear().toString(), [
        Validators.required,
        Validators.pattern('^\\d{4}$'),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      number: ['', [
        Validators.required,
        Validators.pattern('^\\d{5}$'),
        Validators.minLength(5),
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

  verifyCertificate() {
    this.pendingVerificationData = {
      year: this.verifyForm.get('year')?.value,
      number: this.verifyForm.get('number')?.value
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
    
    const { year, number } = this.pendingVerificationData;
    const certificateNumber = `${year}-${number}`;
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

    this.verifyCertificate();
  }

  validateNumberInput(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Allow: 0-9, backspace, tab, enter, delete, left/right arrows, home, end
    if (
      [8, 9, 13, 27, 35, 36, 37, 39, 46].includes(charCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.ctrlKey && [65, 67, 86, 88].includes(charCode)) ||
      // Allow: 0-9 on numpad
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105)
    ) {
      return true;
    }
    
    event.preventDefault();
    return false;
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain');
    if (pastedText && /^\d+$/.test(pastedText)) {
      const target = event.target as HTMLInputElement;
      const isYearField = target.id === 'year';
      const maxLength = isYearField ? 4 : 5;
      const formControlName = isYearField ? 'year' : 'number';
      
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const newValue = target.value.substring(0, start) + pastedText + target.value.substring(end);
      
      if (newValue.length <= maxLength) {
        target.value = newValue;
        this.verifyForm.get(formControlName)?.setValue(newValue);
      }
    }
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
