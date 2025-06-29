import { Component } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-passout-student',
  imports: [],
  templateUrl: './passout-student.component.html',
  styleUrl: './passout-student.component.css'
})
export class PassoutStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
