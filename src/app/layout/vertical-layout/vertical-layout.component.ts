import { Component, OnInit, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MasterDataType, NavbarInfo, ResponseTypeColor, UserRole } from '../../constants/commonConstants';
import { MenuItems } from '../../constants/menuConstants';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/Auth.Service';
import { CustomAlertComponent } from '../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../service/dashboard/dashboard.service';

@Component({
  selector: 'app-vertical-layout',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './vertical-layout.component.html',
  styleUrl: './vertical-layout.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('out', style({
        height: '0px',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('out <=> in', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})

export class VerticalLayoutComponent {
  // Navbar constants with safe defaults
  website_details_description: string = NavbarInfo?.description || 'Default Description';
  website_details_email: string = NavbarInfo?.email || 'default@example.com';
  website_details_phone1: string = NavbarInfo?.phone1 || '000-000-0000';
  website_details_phone2: string = " / " + NavbarInfo?.phone2 || '000-000-0001';
  website_details_youtube_url: string = NavbarInfo?.youtube_url || '#';
  website_details_facebook_url: string = NavbarInfo?.facebook_url || '#';
  website_details_whatsapp_url: string = NavbarInfo?.whatsapp_url || '#';


  faYoutubeIcon = faYoutube;
  faFacebookIcon = faFacebook;
  faWhatsappIcon = faWhatsapp;

  isNavbarOpen: boolean = window.innerWidth > 768;  // Auto-open on large screens
  menuItems: any[] = MenuItems;
  openMenus: { [key: string]: boolean } = {};
  selectedMenu: string = '';

  isUserLoggedIn: boolean = false;
  userName: string | null = null;

  readonly dialog = inject(MatDialog);

  constructor(
    private router: Router, 
    private authService: AuthService,
    private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getAllDashboardMasterData().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Dashboard", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          for (let item of response.data) {
            if (item && item.master_data_value !== null && item.master_data_value !== undefined && item.master_data_value.trim().length > 0) {
              if (item.master_data_type === MasterDataType.EMAIL) {
                this.website_details_email = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.PRIMARY_PHONE) {
                this.website_details_phone1 = item.master_data_value;
              }
              if (item.master_data_type === MasterDataType.SECONDARY_PHONE) {
                this.website_details_phone2 = " / " + item.master_data_value;
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
    this.adjustNavbar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const navbarMenu = document.getElementById('navbar_menu');
    const toggleBar = document.querySelector('.toggle_bar');

    if (
      navbarMenu &&
      !navbarMenu.contains(event.target as Node) &&
      toggleBar && !toggleBar.contains(event.target as Node) &&
      this.isNavbarOpen
    ) {
      this.isNavbarOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustNavbar();
  }

  adjustNavbar() {
    this.isNavbarOpen = window.innerWidth > 768;
  }

  toggleMenu(menuId: string, parentId: string = '', route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }

    if (this.openMenus[menuId]) {
      this.openMenus[menuId] = false;
      return;
    }

    let newOpenMenus: { [key: string]: boolean } = {};

    if (parentId) {
      let parts = parentId.split('-');
      let hierarchy = '';
      for (let part of parts) {
        hierarchy = hierarchy ? `${hierarchy}-${part}` : part;
        newOpenMenus[hierarchy] = true;
      }
    }

    newOpenMenus[menuId] = true;
    this.openMenus = newOpenMenus;
  }

  isMenuOpen(menuId: string): boolean {
    return this.openMenus[menuId] || false;
  }

  selectMenu(item: any): void {
    if (!this.hasSubMenu(item)) {
      this.selectedMenu = item.id.toString();
    }
  }

  hasSubMenu(item: any): boolean {
    return item.subMenu && item.subMenu.length > 0;
  }

  getAnimationState(menuId: string): string {
    return this.isMenuOpen(menuId) ? 'in' : 'out';
  }

  isSelected(menuId: string): boolean {
    return this.selectedMenu === menuId;
  }

  openCloseMenuList(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
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
