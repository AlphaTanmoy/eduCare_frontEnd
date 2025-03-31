import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ElementRef, Renderer2  } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { ResponseTypeColor } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})

export class CustomAlertComponent implements OnInit, AfterViewInit, OnDestroy  {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string; type: number },
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  color_class_text: string = 'text-success';
  color_class_button: string = 'btn-success';

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngAfterViewInit(): void {
    this.bootstrapElements = loadBootstrap();

    if (this.data.type === ResponseTypeColor.WARNING) {
      this.color_class_text = 'text-warning';
      this.color_class_button = 'btn-warning';
    } else if (this.data.type === ResponseTypeColor.INFO) {
      this.color_class_text = 'text-primary';
      this.color_class_button = 'btn-primary';
    } else if (this.data.type === ResponseTypeColor.ERROR) {
      this.color_class_text = 'text-danger';
      this.color_class_button = 'btn-danger';
    }

    console.log(this.color_class_button, this.color_class_text);

    const titleElement = this.el.nativeElement.querySelector('#alert_header');
    const bodyElement = this.el.nativeElement.querySelector('#alert_body');
    const buttonElement = this.el.nativeElement.querySelector('#alert_button_element');

    if (titleElement) {
      this.renderer.addClass(titleElement, this.color_class_text);
    }
    if (bodyElement) {
      this.renderer.addClass(bodyElement, this.color_class_text);
    }
    if (buttonElement) {
      this.renderer.addClass(buttonElement, this.color_class_button);
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
