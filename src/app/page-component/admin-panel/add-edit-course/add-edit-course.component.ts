import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

@Component({
  selector: 'app-add-edit-course',
  imports: [],
  templateUrl: './add-edit-course.component.html',
  styleUrl: './add-edit-course.component.css'
})
export class AddEditCourseComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
