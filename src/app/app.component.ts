import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { VerticalLayoutComponent } from './layout/vertical-layout/vertical-layout.component';
import { HorizontalLayoutComponent } from './layout/horizontal-layout/horizontal-layout.component';
import { AuthService } from './service/auth/Auth.Service';
import { FooterComponent } from './home-page-components/footer/footer.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { loadBootstrap, removeBootstrap } from '../load-bootstrap';
import { IpblockerComponent } from './manage-error-render/ipblocker/ipblocker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    HorizontalLayoutComponent,
    VerticalLayoutComponent,
    FooterComponent,
    IpblockerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  isSmallScreen = window.innerWidth < 1350;
  isLoggedIn = false;
  faExpandArrowsAlt = faExpandArrowsAlt;
  title: any;

  isOnIpBlockerPage: boolean = false;

  constructor(library: FaIconLibrary, private cdRef: ChangeDetectorRef, private authService: AuthService, private router: Router) {
    library.addIcons(faExpandArrowsAlt);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth < 1350;
    //this.setLayout();
  }

  ngOnInit(): void {
    //this.setLayout();
    this.bootstrapElements = loadBootstrap();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const segments = event.urlAfterRedirects.split('/').filter(Boolean);
        const firstRoute = segments[0];

        if (firstRoute == "ip-blocker") {
          this.isOnIpBlockerPage = true;
        }
      });
  }

  isAuthenticatedAndLoggedIn(): boolean {
    return this.authService.isUserLoggedIn() && this.authService.isAuthenticated();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
