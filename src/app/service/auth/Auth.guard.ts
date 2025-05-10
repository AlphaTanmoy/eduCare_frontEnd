import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard activated for:', state.url);
    const token = this.authService.getToken();

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.authService.logout();
      this.openDialog("Login", "Session expired or authentication token not found. Redirecting to login.", ResponseTypeColor.ERROR, '/login');
      return false;
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const requiredRole = route.data['role'];

      if (requiredRole && !requiredRole.includes(decodedToken?.user_role?.toUpperCase())) {
        this.openDialog("Access Denied", "Role mismatch. Unauthorized access.", ResponseTypeColor.ERROR, "/un-authorized");
        return false;
      }

      return true;
    } catch (error) {
      this.openDialog("Login", "Error decoding session info.", ResponseTypeColor.ERROR, "/login");
      return false;
    }
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      window.location.href = navigateRoute;
    });
  }
}
