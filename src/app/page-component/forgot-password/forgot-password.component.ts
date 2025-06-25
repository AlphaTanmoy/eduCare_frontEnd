import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { AuthService } from '../../service/auth/Auth.Service';
import { PasswordService } from '../../service/password/password.service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  showOtpSection = false;
  isResendDisabled = false;
  resendButtonText = 'Send OTP';
  countdown = 60; // 1 minute in seconds
  errorMessage = '';
  showPasswordFields = false;
  showNewPassword = false;
  showConfirmPassword = false;
  private countdownInterval: any;
  matProgressBarVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private passwordService: PasswordService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.pattern(/^[0-9]{6}$/)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordValidator(control: AbstractControl) {
    if (!control.value) return null;
    const value = control.value;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);

    if (!hasLetter || !hasNumber || !hasSpecialChar) {
      return { invalidPassword: true };
    }
    return null;
  }

  private passwordsMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (confirmPassword && newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  get email() { return this.forgotPasswordForm.get('email'); }
  get otp() { return this.forgotPasswordForm.get('otp'); }
  get newPassword() { return this.forgotPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.forgotPasswordForm.get('confirmPassword'); }

  onSendOtp(): void {
    const emailControl = this.forgotPasswordForm.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      return;
    }

    this.activeMatProgressBar();
    this.errorMessage = '';

    this.passwordService.sendOtpForForgotPassword(emailControl.value).subscribe({
      next: () => {
        this.showOtpSection = true;
        this.isResendDisabled = true;
        this.hideMatProgressBar();
        this.startCountdown();
        // OTP sent successfully
      },
      error: (error: any) => {
        console.error('Error sending OTP:', error);
        const errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, null);
        this.hideMatProgressBar();
      },
      complete: () => {
        this.hideMatProgressBar();
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otp?.invalid) {
      this.otp.markAsTouched();
      return;
    }

    this.activeMatProgressBar();
    this.errorMessage = '';
    this.showPasswordFields = true;
    this.startCountdown();
    this.hideMatProgressBar();
  }

  otpTyped() {
    const otp = this.forgotPasswordForm.get('otp')?.value;
    return otp && otp.length === 6;
  }

  onResetPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.activeMatProgressBar();
    this.errorMessage = '';

    const email = this.forgotPasswordForm.get('email')?.value;
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const otp = this.forgotPasswordForm.get('otp')?.value;

    if (!email || !newPassword || !otp) {
      this.errorMessage = 'Please fill in all required fields';
      this.hideMatProgressBar();
      return;
    }

    this.passwordService.forgotPassword(email, newPassword, otp).subscribe({
      next: () => {
        // Password reset successfully
        this.router.navigate(['login']);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        const errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, null);
        this.hideMatProgressBar();
      },
      complete: () => {
        this.hideMatProgressBar();
      }
    });
  }

  onResendOtp(): void {
    const emailControl = this.forgotPasswordForm.get('email');
    if (this.isResendDisabled || !emailControl?.value) return;

    this.otp?.reset();
    this.errorMessage = '';
    this.activeMatProgressBar();

    this.passwordService.sendOtpForForgotPassword(emailControl.value).subscribe({
      next: () => {
        // OTP resent successfully
        this.hideMatProgressBar();
        this.showOtpSection = true;
        this.showPasswordFields = false;
        this.isResendDisabled = true;
        this.resendButtonText = 'Resend OTP';
        this.countdown = 60; // Reset countdown to 60 seconds
        this.startCountdown();
      },
      error: (error: any) => {
        console.error('Error resending OTP:', error);
        const errorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, null);
        this.isResendDisabled = false;
        this.hideMatProgressBar();
      },
      complete: () => {
        this.hideMatProgressBar();
      }
    });
  }

  private startCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.resendButtonText = `Resend OTP (${this.countdown}s)`;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isResendDisabled = false;
        this.resendButtonText = 'Resend OTP';
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  getPasswordErrors() {
    const errors = [];
    const value = this.newPassword?.value || '';

    if (this.newPassword?.errors?.['minlength']) {
      errors.push('Password must be at least 8 characters long');
    }
    if (this.newPassword?.errors?.['invalidPassword']) {
      if (!/[a-zA-Z]/.test(value)) {
        errors.push('Must contain at least one letter');
      }
      if (!/[0-9]/.test(value)) {
        errors.push('Must contain at least one number');
      }
      if (!/[!@#$%^&*]/.test(value)) {
        errors.push('Must contain at least one special character (!@#$%^&*)');
      }
    }
    return errors;
  }

  togglePasswordVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onBackToLogin() {
    if (this.matProgressBarVisible) return;
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
