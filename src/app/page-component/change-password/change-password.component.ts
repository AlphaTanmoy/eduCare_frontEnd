import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/Auth.Service';
import { PasswordService } from '../../service/password/password.service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressBarModule,
    RouterModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup;
  showOtpSection = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  isResendDisabled = false;
  resendButtonText = 'Resend OTP';
  countdown = 60;
  matProgressBarVisible = false;
  private countdownInterval: any;
  fieldInteracted: { [key: string]: boolean } = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    otp: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private passwordService: PasswordService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]],
      otp: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$')
      ]]
    }, { validators: this.passwordMatchValidator });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null = null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        if (navigateRoute === 'logout') {
          this.authService.logout();
        } else {
          window.location.href = navigateRoute;
        }
      }
    });
  }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  private passwordStrengthValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value || '';
      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const valid = hasNumber && hasUpper && hasLower && hasSpecial;
      return valid ? null : { passwordStrength: true };
    };
  }

  private passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onFieldBlur(field: string): void {
    this.fieldInteracted[field] = true;
  }

  shouldShowError(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched || this.fieldInteracted[field]);
  }

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm'): void {
    switch (field) {
      case 'old':
        this.showOldPassword = !this.showOldPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.changePasswordForm.get('newPassword');
    
    if (!passwordControl?.errors) return errors;

    if (passwordControl.errors['required']) {
      errors.push('Password is required');
    }
    if (passwordControl.errors['minlength']) {
      errors.push('Password must be at least 8 characters long');
    }
    if (passwordControl.errors['passwordStrength']) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
    
    return errors;
  }

  isFormValid(): boolean {
    if (!this.showOtpSection) {
      const oldPasswordValid = !!this.changePasswordForm.get('oldPassword')?.valid;
      const newPasswordValid = !!this.changePasswordForm.get('newPassword')?.valid;
      const confirmPasswordValid = !!this.changePasswordForm.get('confirmPassword')?.valid;
      const noMismatchError = !this.changePasswordForm.errors?.['mismatch'];
      
      return oldPasswordValid && newPasswordValid && confirmPasswordValid && noMismatchError;
    } else {
      return !!this.changePasswordForm.get('otp')?.valid;
    }
  }

  private startCountdown(): void {
    this.countdown = 60;
    this.isResendDisabled = true;
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.resendButtonText = `Resend OTP (${this.countdown}s)`;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isResendDisabled = false;
        this.resendButtonText = 'Resend OTP';
      }
    }, 1000);
  }

  onChangePassword(): void {
    if (!this.isFormValid()) {
      return;
    }
    
    this.isLoading = true;
    this.activeMatProgressBar();
    this.errorMessage = '';
    
    const { oldPassword, newPassword, otp } = this.changePasswordForm.value;
    
    this.passwordService.changePassword(oldPassword, newPassword, otp).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.responseType === 'SUCCESS') {
          this.openDialog('Success', 'Password changed successfully', ResponseTypeColor.SUCCESS, '/login');
        } else {
          throw new Error(response.message || 'Failed to change password');
        }
      },
      error: (error) => {
        console.error('Error changing password:', error);
        const errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR);
        this.isLoading = false;
        this.hideMatProgressBar();
      },
      complete: () => {
        this.isLoading = false;
        this.hideMatProgressBar();
      }
    });
  }

  private extractEmailFromUsername(username: string): string | null {
    if (!username) {
      return null;
    }
    
    // If username is in format "User/@{email}"
    if (username.startsWith('User/@')) {
      return username.substring(6); // Remove 'User/@' prefix
    }
    
    // If username is just the email
    if (username.includes('@')) {
      return username;
    }
    
    return null;
  }

  onSendOtp(): void {
    // Mark all fields as touched to trigger validation
    this.changePasswordForm.markAllAsTouched();
    
    // Mark all fields as interacted to show validation messages
    Object.keys(this.fieldInteracted).forEach(key => {
      this.fieldInteracted[key] = true;
    });
    
    // Manually validate the form
    this.changePasswordForm.updateValueAndValidity();
    
    // Check if form is valid and passwords match
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.activeMatProgressBar();
    this.errorMessage = '';
    
    // Get the username and extract email
    const username = this.authService.getUsername();
    const email = this.extractEmailFromUsername(username);
    
    if (!email) {
      this.isLoading = false;
      const errorMessage = 'Could not determine your email address. Please log in again.';
      this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, '/login');
      return;
    }

    this.passwordService.sendOtpForChangePassword(email).subscribe({
      next: (response) => {
        this.showOtpSection = true;
        this.isResendDisabled = true;
        this.startCountdown();
        this.openDialog('Success', 'OTP sent successfully', ResponseTypeColor.SUCCESS);
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        const errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR);
        this.isLoading = false;
        this.hideMatProgressBar();
      },
      complete: () => {
        this.isLoading = false;
        this.hideMatProgressBar();
      }
    });
  }

  onResendOtp(): void {
    if (this.isResendDisabled) return;

    // Reset the OTP field
    this.changePasswordForm.get('otp')?.reset();

    // Reset the countdown
    this.countdown = 60;
    this.isResendDisabled = true;
    this.resendButtonText = 'Resend OTP';

    this.isLoading = true;
    this.activeMatProgressBar();
    this.errorMessage = '';
    
    // Get the username and extract email
    const username = this.authService.getUsername();
    const email = this.extractEmailFromUsername(username);
    
    if (!email) {
      this.isLoading = false;
      this.isResendDisabled = false;
      const errorMessage = 'Could not determine your email address. Please log in again.';
      this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, null);
      return;
    }

    this.passwordService.sendOtpForChangePassword(email).subscribe({
      next: () => {
        this.openDialog('Success', 'OTP resent successfully', ResponseTypeColor.SUCCESS);
        this.startCountdown();
      },
      error: (error) => {
        console.error('Error resending OTP:', error);
        const errorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR);
        this.isResendDisabled = false;
        this.isLoading = false;
        this.hideMatProgressBar();
      },
      complete: () => {
        this.isLoading = false;
        this.hideMatProgressBar();
      }
    });
  }
}
