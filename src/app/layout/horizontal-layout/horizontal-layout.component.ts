import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faYoutube,
  faFacebook,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { NavbarInfo } from '../../constants/commonConstants';
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
export class HorizontalLayoutComponent implements OnInit, AfterViewInit {
  isUserLoggedIn: boolean = false;
  userName: string | null = null;

  // Navbar constants with safe defaults
  website_details_description: string =
    NavbarInfo?.description || 'Default Description';
  website_details_email: string = NavbarInfo?.email || 'default@example.com';
  website_details_phone: string = NavbarInfo?.phone || '000-000-0000';
  website_details_youtube_url: string = NavbarInfo?.youtube_url || '#';
  website_details_facebook_url: string = NavbarInfo?.facebook_url || '#';
  website_details_whatsapp_url: string = NavbarInfo?.whatsapp_url || '#';

  // FontAwesome icons
  faYoutubeIcon = faYoutube;
  faFacebookIcon = faFacebook;
  faWhatsappIcon = faWhatsapp;

  get menuItems(): any[] {
    return MenuItems.filter(
      (item) =>
        (this.isUserLoggedIn && item.showWhenLoggedIn) ||
        (!this.isUserLoggedIn && item.showWhenLoggedOut) ||
        (!item.showWhenLoggedIn && !item.showWhenLoggedOut)
    );
  }

  @ViewChild('navbar') navbar?: ElementRef;
  @ViewChild('navbarNav') navbarNav?: ElementRef;

  isNavFixed = false;
  navbarHeight = 0;
  openItems: Set<number> = new Set();

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    this.authService.loginStatus$.subscribe((status) => {
      this.isUserLoggedIn = status;
      this.getFilteredMenuItems();
      this.cdRef.detectChanges();
    });
  }

  ngAfterViewInit() {
    // Ensure navbar exists before accessing properties
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

  checkUserSession() {
    try {
      const userData = sessionStorage.getItem('user');
      console.log('Session Storage Data:', userData); // Debugging Log
      if (userData) {
        const parsedData = JSON.parse(userData);
        this.isUserLoggedIn = !!parsedData.name;
        this.userName = parsedData.name || 'User';
      } else {
        this.isUserLoggedIn = false;
        this.userName = null;
      }
      console.log(
        'isUserLoggedIn:',
        this.isUserLoggedIn,
        'userName:',
        this.userName
      ); // Debugging Log
      this.cdRef.detectChanges(); // Force UI update
    } catch (error) {
      console.error('Error parsing user session data:', error);
      this.isUserLoggedIn = false;
      this.userName = null;
    }
  }

  loginUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.checkUserSession(); // Call again after setting user session
    this.router.navigate(['/dashboard']); // Redirect after login
  }

  getFilteredMenuItems() {
    return this.menuItems.filter(
      (item) =>
        (this.isUserLoggedIn && item.showWhenLoggedIn) ||
        (!this.isUserLoggedIn && item.showWhenLoggedOut) ||
        (!item.showWhenLoggedIn && !item.showWhenLoggedOut) // For items that always show
    );
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
}
