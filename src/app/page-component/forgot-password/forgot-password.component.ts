import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  showOtpSection = false;
  isResendDisabled = false;
  resendButtonText = 'Send OTP';
  countdown = 60; // 1 minute in seconds
  private countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  get email() { return this.forgotPasswordForm.get('email'); }
  get otp() { return this.forgotPasswordForm.get('otp'); }

  onSendOtp(): void {
    if (this.email?.invalid) {
      this.email.markAsTouched();
      return;
    }

    console.log('Sending OTP to:', this.email?.value);

    this.showOtpSection = true;
    this.isResendDisabled = true;
    this.startCountdown();
  }

  onVerifyOtp(): void {
    if (this.otp?.invalid) {
      this.otp.markAsTouched();
      return;
    }

    alert('OTP verified successfully!');
  }

  onResendOtp(): void {
    if (this.isResendDisabled) return;

    this.otp?.reset();
    this.countdown = 60;
    this.isResendDisabled = true;
    this.resendButtonText = 'Resend OTP';

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

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
    removeBootstrap(this.bootstrapElements);
  }
}
