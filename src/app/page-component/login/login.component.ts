import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { CommonDialogComponent } from '../../common-component/common-dialog/common-dialog.component';
import { jwtDecode } from 'jwt-decode';

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

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  login(userType: string) {
    this.authService.login(this.email, this.password, userType).subscribe({
      next: (response) => {
        if (response.status === 200 && response.responseType === 'SUCCESS') {
          const token = response.token.token; // Extract JWT from response
          sessionStorage.setItem('authToken', token);
          this.authService.saveToken(token);

          try {
            const decodedToken: any = jwtDecode(token);
            const jwtUserRole = decodedToken?.user_role; // Extract user_role from JWT

            console.log('JWT User Role -> ', jwtUserRole);
            console.log('Selected User Type -> ', userType);

            // Validate role
            if (jwtUserRole !== userType) {
              this.logoutUser();
              this.openDialog(
                'Login Mismatch',
                `Please log in as a ${jwtUserRole} instead.`,
                'OK'
              );
              return;
            }

            this.openDialog(
              'Login Successful',
              'You have logged in successfully!',
              'OK'
            );
          } catch (error) {
            console.error('JWT Decoding Error:', error);
            this.openDialog(
              'Error',
              'Invalid token. Please log in again.',
              'Close'
            );
            this.logoutUser();
          }
        } else {
          this.openDialog(
            'Login Failed',
            'Invalid credentials, please try again.',
            'Retry'
          );
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.openDialog(
          'Error',
          'An unexpected error occurred. Please try again later.',
          'Close'
        );
      },
    });
  }

  logoutUser() {
    sessionStorage.clear(); // Clear session data
    this.authService.logout(); // Call logout method if available in AuthService
  }

  openDialog(title: string, message: string, buttonText: string) {
    this.dialog.open(CommonDialogComponent, {
      data: { title, message, buttonText },
    });
  }
}
