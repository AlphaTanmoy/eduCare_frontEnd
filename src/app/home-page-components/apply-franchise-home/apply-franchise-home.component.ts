import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-apply-franchise-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './apply-franchise-home.component.html',
  styles: [`
    .franchise-button {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .franchise-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
    }

    .franchise-button i {
      font-size: 1.3rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .franchise-button .arrow-icon {
      transition: transform 0.3s ease;
    }

    .franchise-button:hover .arrow-icon {
      transform: translateX(4px);
    }
  `]
})
export class ApplyFranchiseHomeComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(private router: Router) {}

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy() {
    removeBootstrap(this.bootstrapElements);
  }

  navigateToFranchiseApplication() {
    this.router.navigate(['/academic/apply-franchise']);
  }
}
