import { Component, OnInit, HostListener } from '@angular/core';
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
  isSmallScreen = window.innerWidth < 1200;
  isLoggedIn = false;
  faExpandArrowsAlt = faExpandArrowsAlt;

  constructor(library: FaIconLibrary, private authService: AuthService,) {
    library.addIcons(faExpandArrowsAlt);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth < 1200;
    this.setLayout();
  }

  ngOnInit(): void {
    this.setLayout();
  }

  setLayout() : void {
    if(this.authService.isUserLoggedIn() && this.authService.isAuthenticated()){
      this.isLoggedIn = true;
    }
  }
}
