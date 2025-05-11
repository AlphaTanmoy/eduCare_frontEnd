import { Component } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-manage-admin',
  imports: [],
  templateUrl: './manage-admin.component.html',
  styleUrl: './manage-admin.component.css'
})
export class ManageAdminComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  
    ngOnInit(): void {
      this.bootstrapElements = loadBootstrap();
    }
  
    ngOnDestroy(): void {
      removeBootstrap(this.bootstrapElements);
    }
}
