import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { OTP_TYPE } from '../../constants/commonConstants';

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

  sendOtpForChangePassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.send_otp_for_password_reset, 
      {
        email: email,
        otpSendType: OTP_TYPE.CHANGE_PASSWORD
      }
    );
  }

  sendOtpForForgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      GetBaseURL() + Endpoints.auth.send_otp_for_password_reset, 
      {
        email: email,
        otpSendType: OTP_TYPE.FORGOT_PASSWORD
      }
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