import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MasterDataService } from '../../service/master-data/master-data.service';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

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

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  pages: number;
}

interface ApiResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: NotificationsResponse[];
}

@Component({
  selector: 'app-view-all-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './view-all-notifications.component.html',
  styleUrls: ['./view-all-notifications.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class ViewAllNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error: string | null = null;
  totalNotifications = 0;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(private masterDataService: MasterDataService) {}


  ngOnInit() {
    this.loadNotifications();
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy() {
    removeBootstrap(this.bootstrapElements);
  }


  private loadNotifications(): void {
    this.loading = true;
    this.masterDataService.getNotifications().subscribe({
      next: (response: any) => {
        if (response?.data?.[0]) {
          const data = response.data[0];
          this.notifications = data.notifications || [];
          this.totalNotifications = data.total || 0;
          this.currentPage = data.page || 1;
          this.totalPages = data.pages || 1;
        } else {
          this.notifications = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading notifications:', err);
        this.error = 'Failed to load notifications. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadNotifications();
    }
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
