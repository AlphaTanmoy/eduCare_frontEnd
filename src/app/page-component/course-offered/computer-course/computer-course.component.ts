import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';


@Component({
  selector: 'app-computer-course',
  imports: [],
  templateUrl: './computer-course.component.html',
  styleUrl: './computer-course.component.css'
})

export class ComputerCourseComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
