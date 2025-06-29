import { Component } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-publish-ticket',
  imports: [],
  templateUrl: './publish-ticket.component.html',
  styleUrl: './publish-ticket.component.css'
})
export class PublishTicketComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
