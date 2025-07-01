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
  styleUrl: './apply-franchise-home.component.css'
})
export class ApplyFranchiseHomeComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(private router: Router) { }

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
