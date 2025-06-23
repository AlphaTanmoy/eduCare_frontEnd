import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../constants/commonConstants';
import { PasswordService, UserProfile } from '../../service/password/password.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  isLoading = true;
  matProgressBarVisible = false;
  error: string | null = null;

  constructor(
    private passwordService: PasswordService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.activeMatProgressBar();
    this.error = null;

    this.passwordService.getUserProfile().subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.length > 0) {
          this.userProfile = response.data[0].user;
        }
        this.isLoading = false;
        this.hideMatProgressBar();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        const errorMessage = error.error?.message || 'Failed to load profile. Please try again later.';
        this.openDialog('Profile Error', errorMessage, ResponseTypeColor.ERROR, null);
        this.isLoading = false;
        this.hideMatProgressBar();
      }
    });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
