import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { NavbarInfo } from '../../constants/commonConstants';
import { MenuItems } from '../../constants/menuConstants';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
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
