import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './Auth.Service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

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
        this.openDialog("Login", "Role mismatch", ResponseTypeColor.ERROR, false);
        this.router.navigate(['/un-authorized']);
        return false;
      }

      this.openDialog("Login", "Access granted", ResponseTypeColor.SUCCESS, false);
      return true;
    } catch (error) {
      this.openDialog("Login", "Error decoding token", ResponseTypeColor.ERROR, false);
      this.router.navigate(['/login']);
      return false;
    }
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
