import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MasterDataService } from '../../service/master-data/master-data.service';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

export interface Notification {
  _id: string;
  notification_code: string;
  heading: string;
  message: string;
  miscData: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: NotificationsResponse[];
}

@Component({
  selector: 'app-view-home-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './view-home-notifications.component.html',
  styleUrls: ['./view-home-notifications.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class ViewHomeNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error: string | null = null;

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.loading = true;
    this.masterDataService.getNotifications_home().subscribe({
      next: (response: ApiResponse) => {
        if (response?.data?.[0]?.notifications) {
          this.notifications = response.data[0].notifications;
        } else {
          this.notifications = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.error = 'Failed to load notifications. Please try again later.';
        this.loading = false;
        this.notifications = [];
      }
    });
  }

  // Get first notification (for template)
  get firstNotification(): Notification | null {
    return this.notifications.length > 0 ? this.notifications[0] : null;
  }

  // Get other notifications (for template)
  get otherNotifications(): Notification[] {
    return this.notifications.length > 1 ? this.notifications.slice(1) : [];
  }

}
