import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { NavbarInfo, UserRole } from '../../constants/commonConstants';
import { MenuItems } from '../../constants/menuConstants';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/Auth.Service';

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
  website_details_description: string = NavbarInfo.description;
  website_details_email: string = NavbarInfo.email;
  website_details_phone: string = NavbarInfo.phone;
  website_details_youtube_url: string = NavbarInfo.youtube_url;
  website_details_facebook_url: string = NavbarInfo.facebook_url;
  website_details_whatsapp_url: string = NavbarInfo.whatsapp_url;

  faYoutubeIcon = faYoutube;
  faFacebookIcon = faFacebook;
  faWhatsappIcon = faWhatsapp;

  isNavbarOpen: boolean = window.innerWidth > 768;  // Auto-open on large screens
  menuItems: any[] = MenuItems;
  openMenus: { [key: string]: boolean } = {};
  selectedMenu: string = '';

  isUserLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit() {
    let isLoggedIn = this.authService.isUserLoggedIn();

    if (!isLoggedIn) {
      this.menuItems = this.menuItems.filter(item => (item.visible && item.visible === true) || (item.showWhenLoggedOut && item.showWhenLoggedOut === true));
      return;
    }

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
}
