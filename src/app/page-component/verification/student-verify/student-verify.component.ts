import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';
import { HumanVerificationComponent } from '../../../common-component/human-verification/human-verification.component';

export interface StudentVerificationResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: {
    studentName: string;
    registrationNumber: string;
    dateOfBirth: string;
    courseName: string;
    franchise: string;
    maritalStatus: string;
    gender: string;
    certificationNumber: string;
    photoUrl: string;
    status: string;
  }[];
}

@Component({
  selector: 'app-student-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HumanVerificationComponent],
  templateUrl: './student-verify.component.html',
  styleUrls: ['./student-verify.component.css']
})
export class StudentVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  showVerification = false;
  studentData: StudentVerificationResponse['data'] | null = null;
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
      year: ['', [
        Validators.required,
        Validators.pattern('^\\d{2}$'),
        Validators.minLength(2),
        Validators.maxLength(2)
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

  verifyStudent() {
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
    const formattedNumber = `ECI${year}-${number}`;
    this.verifySubscription = this.verifyService.verifyStudent(formattedNumber).subscribe({
      next: (response: StudentVerificationResponse) => {
        this.studentData = response.data;
        if (this.studentData?.[0]?.photoUrl) {
          this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.studentData[0].photoUrl
          );
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Verification failed:', error);
        this.errorMessage = error.error?.message || 'Failed to verify student. Please try again.';
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
    this.studentData = null;
    this.safeUrlCache = null;

    this.verifyStudent();
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
      const maxLength = isYearField ? 2 : 5;
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
    if (!this.studentData?.[0]?.photoUrl) {
      return null;
    }
    
    if (this.safeUrlCache) {
      return this.safeUrlCache;
    }
    
    this.safeUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.studentData[0].photoUrl
    );
    return this.safeUrlCache;
  }
  
  getImageUrl(): string {
    return this.studentData?.[0]?.photoUrl || this.defaultImage;
  }
}
