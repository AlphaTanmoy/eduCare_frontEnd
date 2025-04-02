import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';

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

  constructor(private authService: AuthService, private dialog: MatDialog) { }

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
              this.logoutUser();
              this.openDialog("Login", `Please log in as a ${jwtUserRole} instead.`, ResponseTypeColor.INFO, false);
              return;
            }

            this.openDialog("Login", 'You have logged in successfully!', ResponseTypeColor.SUCCESS, true);
          } catch (error) {
            this.openDialog("Login", 'Invalid token/Session expired. Please log in again', ResponseTypeColor.ERROR, false);
            this.logoutUser();
          }
        } else {
          this.openDialog("Login", 'Invalid credentials, please try again', ResponseTypeColor.ERROR, false);
        }
      },
      error: (error) => {
        this.openDialog("Login", 'An unexpected error occurred. Please try again later', ResponseTypeColor.ERROR, false);
      },
    });
  }

  logoutUser() {
    sessionStorage.clear();
    this.authService.logout();
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
