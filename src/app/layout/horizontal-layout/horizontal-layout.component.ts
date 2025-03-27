import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { NavbarInfo } from '../../constants/commonConstants';
import { MenuItems } from '../../constants/menuConstants';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horizontal-layout',
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './horizontal-layout.component.html',
  styleUrl: './horizontal-layout.component.css',
  animations: [
    trigger('submenuAnimation', [
      state('closed', style({ opacity: 0, transform: 'scaleY(0)', visibility: 'hidden' })),
      state('open', style({ opacity: 1, transform: 'scaleY(1)', visibility: 'visible' })),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('200ms ease-in')])
    ])
  ]
})

export class HorizontalLayoutComponent {
  //Navbar consts
  website_details_description: string = NavbarInfo.description;
  website_details_email: string = NavbarInfo.email;
  website_details_phone: string = NavbarInfo.phone;

  //Fontawesome
  faYoutubeIcon = faYoutube;
  faFacebookIcon = faFacebook;
  faWhatsappIcon = faWhatsapp;

  menuItems: any[] = MenuItems;
  subMenuItems1: any[] | undefined;

  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('navbarNav') navbarNav!: ElementRef;

  isNavFixed = false;
  navbarHeight = 0;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.navbarHeight = this.navbar.nativeElement.offsetHeight;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.navbarHeight) {
      this.isNavFixed = true;
    } else {
      this.isNavFixed = false;
    }
  }

  ngOnInit() {

  }

  openItems: Set<number> = new Set();

  toggleMenu(itemId: any, route?: string) {
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
}
