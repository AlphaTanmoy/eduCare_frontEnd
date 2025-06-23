import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { OTP_TYPE } from '../../constants/commonConstants';

export interface UserProfile {
  _id: string;
  user_name: string;
  email: string;
  email_verified: boolean;
  phone: number;
  user_role: string;
  is_verified: boolean;
  data_status: string;
  otp_for_change_password_sent_on?: string;
  otp_for_forgot_password_sent_on?: string;
  accessControlId?: string;
}

export interface ApiResponse<T> {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: T[];
}

interface AuthResponse {
  status: number;
  responseType: string;
  message?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<ApiResponse<{ user: UserProfile }>> {
    return this.http.get<ApiResponse<{ user: UserProfile }>>(
      GetBaseURL() + Endpoints.auth.get_profile
    ).pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(() => new Error('Failed to fetch user profile'));
      })
    );
  }

  sendOtpForChangePassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.send_otp_for_password_reset, 
      {
        email: email,
        otpSendType: OTP_TYPE.CHANGE_PASSWORD
      }
    ).pipe(
      catchError(error => {
        console.error('Error sending OTP for password change:', error);
        return throwError(() => new Error('Failed to send OTP for password change'));
      })
    );
  }

  sendOtpForForgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.send_otp_for_password_reset, 
      {
        email: email,
        otpSendType: OTP_TYPE.FORGOT_PASSWORD
      }
    ).pipe(
      catchError(error => {
        console.error('Error sending OTP for forgot password:', error);
        return throwError(() => new Error('Failed to send OTP for password reset'));
      })
    );
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.forgot_password,
      { email, otp, newPassword }
    ).pipe(
      catchError(error => {
        console.error('Error resetting password:', error);
        return throwError(() => new Error('Failed to reset password'));
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.change_password, 
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
        otp: otp
      }
    );
  }

  forgotPassword(email: string, newPassword: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.forgot_password, 
      {
        email: email,
        newPassword: newPassword,
        otp: otp
      }
    );
  }
}