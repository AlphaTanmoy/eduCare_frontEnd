import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-manage-wallet',
  imports: [],
  templateUrl: './manage-wallet.component.html',
  styleUrl: './manage-wallet.component.css'
})
export class ManageWalletComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
