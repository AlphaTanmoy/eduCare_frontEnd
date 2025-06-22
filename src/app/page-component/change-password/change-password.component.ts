import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup;
  showOtpSection = false;
  isResendDisabled = false;
  resendButtonText = 'Send OTP';
  countdown = 60;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // Track field interactions
  fieldInteracted: { [key: string]: boolean } = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    otp: false
  };
  
  private countdownInterval: any;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        // Custom validator for password requirements
        (control: AbstractControl) => {
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
      ]],
      confirmPassword: ['', [Validators.required]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    }, { validators: [this.passwordMatchValidator, this.passwordsMatchValidator] });

    // Add value change subscription to validate on password change
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.changePasswordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
    removeBootstrap(this.bootstrapElements);
  }

  get f() { return this.changePasswordForm.controls; }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Additional validator to show error on confirm password field
  passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (confirmPassword && newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if passwords match
      formGroup.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  getPasswordErrors() {
    const errors = [];
    const newPassword = this.f['newPassword'];
    const value = newPassword?.value || '';
    
    if (newPassword?.errors?.['minlength']) {
      errors.push('Password must be at least 8 characters long');
    }
    if (newPassword?.errors?.['invalidPassword']) {
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

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm'): void {
    if (field === 'old') this.showOldPassword = !this.showOldPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFieldBlur(fieldName: string) {
    this.fieldInteracted[fieldName] = true;
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.changePasswordForm.get(fieldName);
    return (control?.invalid && (control?.dirty || control?.touched || this.fieldInteracted[fieldName])) || false;
  }

  onSendOtp(): void {
    console.log('onSendOtp called');
    
    // Mark all fields as touched to trigger validation
    this.changePasswordForm.markAllAsTouched();
    
    // Mark all fields as interacted to show validation messages
    Object.keys(this.fieldInteracted).forEach(key => {
      this.fieldInteracted[key] = true;
    });
    
    // Manually validate the form
    this.changePasswordForm.updateValueAndValidity();
    
    // Check if form is valid and passwords match
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
    const passwordsMatch = newPassword === confirmPassword;
    
    console.log('onSendOtp - Validation Check:', {
      formValid: this.changePasswordForm.valid,
      formErrors: this.changePasswordForm.errors,
      newPassword,
      confirmPassword,
      passwordsMatch,
      isFormValid: this.isFormValid(),
      showOtpSection: this.showOtpSection // Current state before change
    });
    
    if (!this.isFormValid() || !passwordsMatch) {
      console.log('Form is not valid, not sending OTP');
      console.log('Form validity:', {
        oldPassword: this.changePasswordForm.get('oldPassword')?.valid,
        newPassword: this.changePasswordForm.get('newPassword')?.valid,
        confirmPassword: this.changePasswordForm.get('confirmPassword')?.valid,
        formValid: this.changePasswordForm.valid,
        passwordsMatch
      });
      return;
    }

    console.log('Form is valid, showing OTP section');
    
    // Here you would typically call your API to send OTP
    this.showOtpSection = true;
    this.isResendDisabled = true;
    
    console.log('showOtpSection set to:', this.showOtpSection);
    
    // Force change detection to update the view
    setTimeout(() => {
      console.log('After timeout - showOtpSection:', this.showOtpSection);
    });
    
    this.startCountdown();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    // Here you would typically call your API to change password
    alert('Password changed successfully!');
  }

  onResendOtp(): void {
    if (this.isResendDisabled) return;

    // Reset the OTP field
    this.changePasswordForm.get('otp')?.reset();
    
    // Reset the countdown
    this.countdown = 60;
    this.isResendDisabled = true;
    this.resendButtonText = 'Resend OTP';
    
    // Log the resend action
    console.log('Resending OTP...');
    
    // Here you would typically call your API to resend OTP
    
    // Start the countdown
    this.startCountdown();
  }

  private startCountdown(): void {
    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  isFormValid(): boolean {
    const oldPassword = this.changePasswordForm.get('oldPassword');
    const newPassword = this.changePasswordForm.get('newPassword');
    const confirmPassword = this.changePasswordForm.get('confirmPassword');
    
    // Check if all required fields have values
    const hasValues = oldPassword?.value && newPassword?.value && confirmPassword?.value;
    
    // Check if all fields are valid
    const oldPasswordValid = oldPassword?.valid;
    const newPasswordValid = newPassword?.valid;
    const confirmPasswordValid = confirmPassword?.valid;
    
    // Check if passwords match
    const passwordsMatch = newPassword?.value === confirmPassword?.value;
    
    // Check if there are any password mismatch errors
    const noMismatchError = !this.changePasswordForm.hasError('mismatch') && 
                           !confirmPassword?.hasError('passwordMismatch');
    
    // Log detailed debug info
    console.log('Form Validation Check:', {
      fields: {
        oldPassword: { value: oldPassword?.value, valid: oldPasswordValid, errors: oldPassword?.errors },
        newPassword: { value: newPassword?.value, valid: newPasswordValid, errors: newPassword?.errors },
        confirmPassword: { value: confirmPassword?.value, valid: confirmPasswordValid, errors: confirmPassword?.errors }
      },
      validation: {
        hasValues,
        allFieldsValid: oldPasswordValid && newPasswordValid && confirmPasswordValid,
        passwordsMatch,
        noMismatchError
      },
      finalResult: hasValues && oldPasswordValid && newPasswordValid && confirmPasswordValid && passwordsMatch && noMismatchError
    });
    
    return hasValues && oldPasswordValid && newPasswordValid && confirmPasswordValid && passwordsMatch && noMismatchError;
  }

  // Keeping this for backward compatibility, but it's now deprecated in favor of isFormValid()
  isSendOtpButtonEnabled(): boolean {
    const oldPassword = this.changePasswordForm.get('oldPassword');
    const newPassword = this.changePasswordForm.get('newPassword');
    const confirmPassword = this.changePasswordForm.get('confirmPassword');
    
    // Manually check each field's validity
    const oldPasswordValid = oldPassword?.valid;
    const newPasswordValid = newPassword?.valid;
    const confirmPasswordValid = confirmPassword?.valid;
    
    // Check if all required fields have values
    const hasValues = oldPassword?.value && newPassword?.value && confirmPassword?.value;
    
    // Check if passwords match
    const passwordsMatch = newPassword?.value === confirmPassword?.value;
    
    // Check if all fields are valid
    const allFieldsValid = oldPasswordValid && newPasswordValid && confirmPasswordValid;
    
    // Check if there are any password mismatch errors
    const noMismatchError = !this.changePasswordForm.hasError('mismatch') && 
                           !confirmPassword?.hasError('passwordMismatch');
    
    // Log detailed debug info
    console.log('Button State Check:', {
      oldPassword: { 
        value: oldPassword?.value, 
        valid: oldPasswordValid, 
        errors: oldPassword?.errors,
        touched: oldPassword?.touched,
        dirty: oldPassword?.dirty
      },
      newPassword: { 
        value: newPassword?.value, 
        valid: newPasswordValid, 
        errors: newPassword?.errors
      },
      confirmPassword: { 
        value: confirmPassword?.value, 
        valid: confirmPasswordValid, 
        errors: confirmPassword?.errors 
      },
      validation: {
        allFieldsValid,
        hasValues,
        passwordsMatch,
        noMismatchError,
        formValid: this.changePasswordForm.valid,
        formErrors: this.changePasswordForm.errors
      },
      finalResult: hasValues && allFieldsValid && passwordsMatch && noMismatchError
    });
    
    // Return true only if all conditions are met
    return hasValues && allFieldsValid && passwordsMatch && noMismatchError;
  }
}
