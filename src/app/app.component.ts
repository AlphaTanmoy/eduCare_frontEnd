import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalLayoutComponent } from './layout/vertical-layout/vertical-layout.component';
import { HorizontalLayoutComponent } from './layout/horizontal-layout/horizontal-layout.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HorizontalLayoutComponent, VerticalLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  isSmallScreen = window.innerWidth < 1200;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth < 1200;
  }
}
