import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IndexedDBItemKey, UserRole } from '../../constants/commonConstants';
import { IndexedDbService } from '../indexed-db/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private tokenKey = 'authToken';
  private endPoint = GetBaseURL() + Endpoints.auth.login;
  private jwtHelper = new JwtHelperService();
  private loginStatusSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  loginStatus$ = this.loginStatusSubject.asObservable();
  private tokenCheckInterval?: Subscription;

  constructor(private http: HttpClient, private indexedDbService: IndexedDbService) {
    this.startTokenExpirationWatcher();
  }

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
    sessionStorage.setItem(this.tokenKey, token);
    this.loginStatusSubject.next(true);
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return UserRole.COMMON;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.user_role || UserRole.COMMON;
    } catch (error) {
      console.error('Error decoding token:', error);
      return UserRole.COMMON;
    }
  }

  getUserId(): string | null{
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return UserRole.COMMON;
    }
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return "User";

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return (decodedToken?.user_name) ? "User/@" + decodedToken?.user_name : "User";
    } catch (error) {
      console.error('Error decoding token:', error);
      return "User";
    }
  }

  isUserLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    sessionStorage.clear();
    this.indexedDbService.deleteItem(IndexedDBItemKey.dashboard_slideshow_images);
    this.loginStatusSubject.next(false);
    window.location.href = '/login'; // Redirect to login on logout
  }

  private startTokenExpirationWatcher() {
    this.tokenCheckInterval = interval(3000).subscribe(() => {
      const token = this.getToken();
      if (token && this.jwtHelper.isTokenExpired(token)) {
        console.warn('Session expired. Logging out...');
        this.logout();
      }
    });
  }

  ngOnDestroy() {
    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
    }
  }
}
