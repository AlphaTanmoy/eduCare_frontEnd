import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../../../constants/commonConstants';

@Component({
  selector: 'app-view-center-head',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './view-center-head.component.html',
  styleUrl: './view-center-head.component.css'
})
export class ViewCenterHeadComponent implements OnInit, AfterViewInit, OnDestroy {
  center_head_id: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { center_head_id: string },
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.center_head_id = this.data.center_head_id;
  }

  ngAfterViewInit(): void {
    // Set classes based on alert type
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
