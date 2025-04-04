import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { VerticalLayoutComponent } from './layout/vertical-layout/vertical-layout.component';
import { HorizontalLayoutComponent } from './layout/horizontal-layout/horizontal-layout.component';
import { AuthService } from './service/auth/Auth.Service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    HorizontalLayoutComponent,
    VerticalLayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isSmallScreen = window.innerWidth < 1350;
  isLoggedIn = false;
  faExpandArrowsAlt = faExpandArrowsAlt;
  title: any;

  constructor(library: FaIconLibrary, private cdRef: ChangeDetectorRef, private authService: AuthService,) {
    library.addIcons(faExpandArrowsAlt);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth < 1350;
    //this.setLayout();
  }

  ngOnInit(): void {
    //this.setLayout();
  }

  isAuthenticatedAndLoggedIn() : boolean {
    return this.authService.isUserLoggedIn() && this.authService.isAuthenticated();
  }
}
