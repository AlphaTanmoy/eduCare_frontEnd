import { Component } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-course-offered',
  imports: [],
  templateUrl: './course-offered.component.html',
  styleUrl: './course-offered.component.css'
})
export class CourseOfferedComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
