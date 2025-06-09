import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-pay-wallet',
  imports: [],
  templateUrl: './pay-wallet.component.html',
  styleUrl: './pay-wallet.component.css'
})
export class PayWalletComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
