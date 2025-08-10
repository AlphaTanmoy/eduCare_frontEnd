import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VerifyService } from '../../../../app/service/verify/verify.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { HumanVerificationComponent } from '../../../common-component/human-verification/human-verification.component';
import { ResponseTypeColor } from '../../../constants/commonConstants';

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
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    MatDialogModule,
    HumanVerificationComponent
  ],
  templateUrl: './course-certificate-verify.component.html',
  styleUrls: ['./course-certificate-verify.component.css']
})
export class CourseCertificateVerifyComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  verifyForm: FormGroup;
  isLoading = false;
  showVerification = false;
  maxDate: Date = new Date();
  minDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  certificateData: CertificateVerificationResponse['data'] | null = null;
  errorMessage: string | null = null;
  private safeUrlCache: SafeResourceUrl | null = null;
  private verifySubscription: Subscription | null = null;
  defaultImage = '/images/educare_logo.png';
  private pendingVerificationData: { year: string; number: string; dob: string } | null = null;
  
  get year() { return this.verifyForm.get('year'); }
  get number() { return this.verifyForm.get('number'); }
  get dob() { return this.verifyForm.get('dob'); }

  constructor(
    private fb: FormBuilder,
    private verifyService: VerifyService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.verifyForm = this.fb.group({
      year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      number: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      dob: ['', [Validators.required, this.validateDob.bind(this)]]
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

  // Custom validator for date of birth
  validateDob(control: any): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);

    if (selectedDate > today) {
      return { futureDate: true };
    }
    if (selectedDate < hundredYearsAgo) {
      return { tooOld: true };
    }
    return null;
  }

  private verifyCertificateRequest(certificateNumber: string, formattedDob: string) {
    this.isLoading = true;
    
    this.verifySubscription = this.verifyService.verifyCertificate(certificateNumber, formattedDob).subscribe({
      next: (response: CertificateVerificationResponse) => {
        this.isLoading = false;
        
        if (response.status === 200 && response.data && response.data.length > 0) {
          this.certificateData = response.data;
          this.safeUrlCache = this.getSafeUrl();
          this.errorMessage = null;
          
          this.openDialog('Verification Successful', 'Certificate verified successfully!', ResponseTypeColor.SUCCESS, null);
        } else {
          const errorMessage = response.message || 'No certificate found with the provided details.';
          this.errorMessage = errorMessage;
          this.certificateData = null;
          this.safeUrlCache = null;
          this.openDialog('Verification Failed', errorMessage, ResponseTypeColor.ERROR, null);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.certificateData = null;
        this.safeUrlCache = null;
        
        let errorMessage = 'An error occurred while verifying the certificate.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.errorMessage = errorMessage;
        this.openDialog('Verification Failed', errorMessage, ResponseTypeColor.ERROR, null);
      }
    });
  }

  verifyCertificate() {
    this.verifyForm.markAllAsTouched();
    
    if (this.verifyForm.invalid) {
      const formErrors = [];
      
      if (this.year?.errors?.['required']) formErrors.push('Year is required');
      if (this.year?.errors?.['pattern']) formErrors.push('Year must be 4 digits');
      
      if (this.number?.errors?.['required']) formErrors.push('Certificate number is required');
      if (this.number?.errors?.['pattern']) formErrors.push('Certificate number must be 5 digits');
      
      if (this.dob?.errors?.['required']) formErrors.push('Date of birth is required');
      
      const errorMessage = formErrors.length > 0 
        ? 'Please fix the following errors:<br>' + formErrors.join('<br>')
        : 'Please check your input and try again.';
      
      this.openDialog('Validation Error', errorMessage, ResponseTypeColor.ERROR, null);
      return;
    }

    const { year, number, dob } = this.verifyForm.value;
    
    if (!year || !number || !dob) {
      this.openDialog('Validation Error', 'Please fill in all required fields', ResponseTypeColor.ERROR, null);
      return;
    }

    const certificateNumber = `${year}-${number.padStart(5, '0')}`;
    const formattedDob = new Date(dob).toISOString().split('T')[0];
    this.pendingVerificationData = { year, number, dob };
    
    // Only show verification if needed, otherwise make the API call directly
    this.showVerification = true; // Set to true to show human verification
    
    // If you want to skip verification for testing, uncomment the next line and comment the one above
    // this.verifyCertificateRequest(certificateNumber, formattedDob);
  }

  onVerificationComplete() {
    this.showVerification = false;
    if (!this.pendingVerificationData) {
      this.openDialog('Error', 'No verification data available', ResponseTypeColor.ERROR, null);
      return;
    }

    const { year, number, dob } = this.pendingVerificationData;
    const certificateNumber = `${year}-${number.padStart(5, '0')}`;
    const formattedDob = new Date(dob).toISOString().split('T')[0];
    
    // Call the private method to handle the API request
    this.verifyCertificateRequest(certificateNumber, formattedDob);
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { 
        title: dialogTitle, 
        text: dialogText, 
        type: dialogType 
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }

  getImageUrl(): string {
    return this.certificateData?.[0]?.certificatePhotoUrl || this.defaultImage;
  }
}