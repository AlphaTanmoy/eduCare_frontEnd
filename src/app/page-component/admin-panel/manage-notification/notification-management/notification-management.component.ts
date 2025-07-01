import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Notification {
  _id: string;
  heading: string;
  message: string;
  notification_code?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  __v?: number;
}

@Component({
  selector: 'app-notification-management',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.css'],
  host: { 'class': 'd-block' }
})
export class NotificationManagementComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery: string = '';
  lastUpdated: Date | null = null;
  private subscriptions = new Subscription();
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private masterDataService: MasterDataService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Initializing NotificationManagementComponent');
    console.log('User role should be MASTER to access this page');
    this.loadNotifications();
    this.bootstrapElements = loadBootstrap();
    this.removeBackdropOverlays();
  }


  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
    this.subscriptions.unsubscribe();
  }

  private removeBackdropOverlays(): void {
    // Check after a short delay to ensure the DOM is fully loaded
    setTimeout(() => {
      // Remove any Material dialog backdrops
      const materialBackdrops = document.querySelectorAll('.cdk-overlay-backdrop, .cdk-overlay-dark-backdrop, .cdk-overlay-container');
      materialBackdrops.forEach(backdrop => {
        console.log('Removing backdrop:', backdrop);
        backdrop.remove();
      });

      // Remove any Bootstrap modals
      const bootstrapModals = document.querySelectorAll('.modal-backdrop');
      bootstrapModals.forEach(modal => {
        console.log('Removing modal backdrop:', modal);
        modal.remove();
      });

      // Remove any overlay containers
      const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
      overlayContainers.forEach(container => {
        console.log('Removing overlay container:', container);
        container.remove();
      });

      // Remove any body classes that might be causing the darkening
      document.body.classList.remove('cdk-global-scrollblock', 'modal-open');
    }, 100);
  }

  getActiveNotificationsCount(): number {
    return this.notifications?.length || 0;
  }

  // Filter notifications based on search query
  get filteredNotifications(): Notification[] {
    if (!this.searchQuery?.trim()) {
      return this.notifications || [];
    }
    const query = this.searchQuery.toLowerCase().trim();
    return (this.notifications || []).filter(notification => {
      const heading = notification?.heading?.toLowerCase() || '';
      const message = notification?.message?.toLowerCase() || '';
      return heading.includes(query) || message.includes(query);
    });
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Loading notifications...');

    this.masterDataService.getNotifications().subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response?.data?.[0]?.notifications) {
          this.notifications = response.data[0].notifications;
          this.lastUpdated = new Date();
          console.log('Successfully loaded', this.notifications.length, 'notifications');
        } else {
          this.error = response?.message || 'No data received from server';
          console.error('Invalid response format:', response);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading notifications:', err);
        this.error = 'Failed to load notifications. Please try again later.';
        this.isLoading = false;

        // If it's a 401/403, the user might not have permission
        if (err.status === 401 || err.status === 403) {
          this.error = 'You do not have permission to access this resource';
        }
      }
    });
  }

  confirmDelete(notification: Notification): void {
    const heading = notification?.heading || 'this notification';

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, {
      data: {
        text: `Are you sure you want to delete "${heading}"? This action cannot be undone.`
      },
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteNotification(notification._id);
      }
      dialogSub.unsubscribe();
    });
  }

  private deleteNotification(notificationId: string): void {
    this.isLoading = true;
    this.error = null;

    console.log('Attempting to delete notification with ID:', notificationId);
    
    const deleteSub = this.masterDataService.deleteNotification(notificationId).subscribe({
      next: (response: any) => {
        console.log('Raw delete response:', response);
        
        if (response?.responseType === 'SUCCESS' || response?.success) {
          this.notifications = this.notifications.filter(n => n._id !== notificationId);
          this.openDialog('Success', 'Notification deleted successfully', ResponseTypeColor.SUCCESS, false);
        } else {
          const errorMessage = response?.message || response?.error || 'Failed to delete notification';
          console.error('Delete failed - Response:', response);
          this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
        }
      },
      error: (error) => {
        let errorMessage = 'An error occurred while deleting the notification';
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
      },
      complete: () => {
        this.isLoading = false;
        deleteSub.unsubscribe();
      }
    });
  }

  private openDialog(title: string, message: string, type: number, reload: boolean = false): void {
    // Map the ResponseTypeColor to the values expected by CustomAlertComponent
    const alertTypeMap = {
      [ResponseTypeColor.SUCCESS]: 1, // SUCCESS
      [ResponseTypeColor.WARNING]: 2, // WARNING
      [ResponseTypeColor.INFO]: 3,    // INFO
      [ResponseTypeColor.ERROR]: 4    // ERROR
    };

    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: title,
        text: message,
        type: alertTypeMap[type] || 1 // Default to SUCCESS if not found
      },
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      if (reload) {
        this.loadNotifications();
      }
      dialogSub.unsubscribe();
    });
  }
}
