import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from '../../constants/commonConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private endPoint = GetBaseURL() + Endpoints.auth.login;
  private jwtHelper = new JwtHelperService();
  private loginStatusSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string, userType: string): Observable<any> {
    return this.http.post(this.endPoint, { email, password, userType });
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  saveToken(token: string) {
    sessionStorage.setItem('authToken', token);
    this.loginStatusSubject.next(true);
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return UserRole.GUEST;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.user_role || UserRole.GUEST;
    } catch (error) {
      console.error('Error decoding token:', error);
      return UserRole.GUEST;
    }
  }

  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  logout() {
    sessionStorage.clear();
  }

}
