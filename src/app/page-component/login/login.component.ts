import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ActiveInactiveStatus, IndexedDBItemKey, ResponseTypeColor } from '../../constants/commonConstants';
import { Router, RouterModule } from '@angular/router';
import { IndexedDbService } from '../../service/indexed-db/indexed-db.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  constructor(private authService: AuthService, private indexedDbService: IndexedDbService, private dialog: MatDialog, private router: Router) { }

  login(userType: string) {
    this.authService.login(this.email, this.password, userType).subscribe({
      next: (response: any) => {
        // Check if response has token in the expected format
        const token = response?.token?.token || response?.token;
        
        if (token) {
          sessionStorage.clear();
          this.indexedDbService.deleteItem(IndexedDBItemKey.dashboard_slideshow_images);
          sessionStorage.setItem('authToken', token);
          this.authService.saveToken(token);

          try {
            const decodedToken: any = jwtDecode(token);
            console.log('Decoded Token:', decodedToken); // Debug log
            
            const jwtUserRole = decodedToken?.user_role || decodedToken?.userRole;
            const isEmailVerified = decodedToken?.email_verified || decodedToken?.is_verified;
            const isActive = decodedToken?.data_status !== ActiveInactiveStatus.INACTIVE;
            
            // Check if user role matches
            if (jwtUserRole && jwtUserRole.toLowerCase() !== userType.toLowerCase()) {
              this.openDialog("Login", `Your credential has ${jwtUserRole} role assigned.`, ResponseTypeColor.INFO, 'logout');
              return;
            }

            // Check if account is verified and active
            if (!isEmailVerified) {
              this.openDialog("Login", `Your email is not verified. Please verify your email.`, ResponseTypeColor.INFO, 'logout');
              return;
            }

            if (!isActive) {
              this.openDialog("Login", `Your account is inactive. Please contact support.`, ResponseTypeColor.ERROR, 'logout');
              return;
            }

            // Successful login
            this.openDialog("Login", 'You have logged in successfully!', ResponseTypeColor.SUCCESS, "/home");
          } catch (error) {
            console.error('Token decode error:', error);
            this.openDialog("Login", 'Invalid token format. Please try again.', ResponseTypeColor.ERROR, 'logout');
          }
        } else {
          // Handle case where token is missing
          const errorMessage = response?.message || 'Invalid response from server. Please try again.';
          this.openDialog("Login", errorMessage, ResponseTypeColor.ERROR, null);
        }
      },
      error: (error: any) => {
        console.log('Login error:', error);
        const errorMessage = error.error?.message || 
                             error.message || 
                             'An unexpected error occurred. Please try again later';
        this.openDialog("Login", errorMessage, ResponseTypeColor.ERROR, null);
      },
    });
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: any): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (navigateRoute) {
        if (navigateRoute === 'logout') {
          this.authService.logout();
        } else {
          window.location.href = navigateRoute;
        }
      }
    });
  }
}
