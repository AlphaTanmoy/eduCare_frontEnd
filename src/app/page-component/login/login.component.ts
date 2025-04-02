import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  constructor(private authService: AuthService, private dialog: MatDialog, private router: Router) { }

  login(userType: string) {
    this.authService.login(this.email, this.password, userType).subscribe({
      next: (response) => {
        if (response.status === 200 && response.responseType === 'SUCCESS') {
          const token = response.token.token;
          sessionStorage.setItem('authToken', token);
          this.authService.saveToken(token);

          try {
            const decodedToken: any = jwtDecode(token);
            const jwtUserRole = decodedToken?.user_role;

            console.log('JWT User Role -> ', jwtUserRole);
            console.log('Selected User Type -> ', userType);

            if (jwtUserRole !== userType) {
              this.authService.logout();
              this.openDialog("Login", `Your credential has ${jwtUserRole} role assigned.`, ResponseTypeColor.INFO, null);
              return;
            }

            this.openDialog("Login", 'You have logged in successfully!', ResponseTypeColor.SUCCESS, "/home");
          } catch (error) {
            this.openDialog("Login", 'Invalid token/Session expired. Please log in again', ResponseTypeColor.ERROR, null);
            this.authService.logout();
          }
        } else {
          this.openDialog("Login", 'Invalid credentials, please try again', ResponseTypeColor.ERROR, null);
        }
      },
      error: (error) => {
        this.openDialog("Login", 'An unexpected error occurred. Please try again later', ResponseTypeColor.ERROR, null);
      },
    });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: any): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (navigateRoute) {
        this.router.navigate([navigateRoute]);
      }
    });
  }
}
