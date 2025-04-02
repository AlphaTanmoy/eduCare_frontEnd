import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './Auth.Service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard activated for:', state.url);
    const token = this.authService.getToken();

    if (!token || this.jwtHelper.isTokenExpired(token)) {
        console.log('Token expired or not found. Redirecting to login.');
        this.router.navigate(['/login']);
        return false;
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded Token:', decodedToken);

      const requiredRole = route.data['role'];
      console.log('Required Role:', requiredRole);
      console.log('Token User Role:', decodedToken?.user_role);

      if (requiredRole && decodedToken?.user_role?.toUpperCase() !== requiredRole.toUpperCase()) {
          console.log('Role mismatch.');
          this.router.navigate(['/un-authorized']);
          return false;
      }

      console.log('Access granted.');
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
