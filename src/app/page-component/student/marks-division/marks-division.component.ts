import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

@Component({
  selector: 'app-marks-division',
  imports: [],
  templateUrl: './marks-division.component.html',
  styleUrl: './marks-division.component.css'
})

export class MarksDivisionComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
