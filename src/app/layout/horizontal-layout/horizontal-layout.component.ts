import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faYoutube,
  faFacebook,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { MasterDataType, NavbarInfo, ResponseTypeColor, UserRole } from '../../constants/commonConstants';
import { MenuItems } from '../../constants/menuConstants';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../service/auth/Auth.Service';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-horizontal-layout',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './horizontal-layout.component.html',
  styleUrls: ['./horizontal-layout.component.css'],
  animations: [
    trigger('submenuAnimation', [
      state(
        'closed',
        style({ opacity: 0, transform: 'scaleY(0)', visibility: 'hidden' })
      ),
      state(
        'open',
        style({ opacity: 1, transform: 'scaleY(1)', visibility: 'visible' })
      ),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('200ms ease-in')]),
    ]),
  ],
})
export class HorizontalLayoutComponent implements AfterViewInit {
  isUserLoggedIn: boolean = false;
  userName: string | null = null;
  menuItems: any[] = MenuItems;

  // Navbar constants with safe defaults
  website_details_description: string = NavbarInfo?.description || 'Default Description';
  website_details_email: string = NavbarInfo?.email || 'default@example.com';
  website_details_phone: string = NavbarInfo?.phone || '000-000-0000';
  website_details_youtube_url: string = NavbarInfo?.youtube_url || '#';
  website_details_facebook_url: string = NavbarInfo?.facebook_url || '#';
  website_details_whatsapp_url: string = NavbarInfo?.whatsapp_url || '#';

  // FontAwesome icons
  faYoutubeIcon = faYoutube;
  faFacebookIcon = faFacebook;
  faWhatsappIcon = faWhatsapp;

  @ViewChild('navbar') navbar?: ElementRef;
  @ViewChild('navbarNav') navbarNav?: ElementRef;

  isNavFixed = false;
  navbarHeight = 0;
  openItems: Set<number> = new Set();

  readonly dialog = inject(MatDialog);

  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.dashboardService.getAllDashboardMasterData().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Dashboard", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          for (let item of response.data) {
            if (item.master_data_type === MasterDataType.EMAIL) {
              this.website_details_email = item.master_data_value;
            }
            if (item.master_data_type === MasterDataType.PRIMARY_PHONE) {
              this.website_details_phone = "+91 " + item.master_data_value;
            }
            if (item.master_data_type === MasterDataType.SECONDARY_PHONE) {
              this.website_details_phone += " / " + item.master_data_value;
            }
            if (item.master_data_type === MasterDataType.FACEBOOK) {
              this.website_details_facebook_url = item.master_data_value;
            }
            if (item.master_data_type === MasterDataType.YOUTUBE) {
              this.website_details_youtube_url = item.master_data_value;
            }
            if (item.master_data_type === MasterDataType.WHATSAPP) {
              this.website_details_whatsapp_url = item.master_data_value;
            }
          }
        } catch (error) {
          this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.openDialog("Dashboard", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });


    let isLoggedIn = this.authService.isUserLoggedIn();

    if (!isLoggedIn) {
      this.menuItems = this.menuItems.filter(item => (item.visible && item.visible === true) || (item.showWhenLoggedOut && item.showWhenLoggedOut === true));
      return;
    }

    let user_name = this.authService.getUsername();

    this.menuItems.forEach(item => {
      if (item.name === 'User') {
        item.name = user_name;
      }
    });

    let isLoggedInUserNotAnAdmin = (this.authService.getUserRole() !== UserRole.ADMIN);

    if (isLoggedInUserNotAnAdmin) {
      this.menuItems = this.menuItems.filter(item => !item.showWhenAdminLoggedIn);
    }

    this.menuItems = this.menuItems.filter(item => (item.visible && item.visible === true) || (item.showWhenAdminLoggedIn && item.showWhenAdminLoggedIn === true) || (item.showWhenLoggedIn && item.showWhenLoggedIn === true));
  }

  ngAfterViewInit() {
    if (this.navbar?.nativeElement) {
      this.navbarHeight = this.navbar.nativeElement.offsetHeight;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isNavFixed = scrollPosition >= this.navbarHeight;
  }

  toggleMenu(itemId: any, route?: string, action?: string) {
    if (route) {
      this.router.navigate([route]);
    }
    if (this.openItems.has(itemId)) {
      this.openItems.delete(itemId);
    } else {
      this.openItems.add(itemId);
    }
  }

  closeAllMenus() {
    this.openItems.clear();
  }

  onMouseLeave(itemId: any) {
    this.openItems.delete(itemId);
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
