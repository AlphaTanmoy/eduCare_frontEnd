import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';


@Component({
  selector: 'app-center-login',
  imports: [],
  templateUrl: './center-login.component.html',
  styleUrl: './center-login.component.css'
})

export class CenterLoginComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
