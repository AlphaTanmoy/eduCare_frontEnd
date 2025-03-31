import { Component, OnInit, OnDestroy, Inject  } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})

export class CustomAlertComponent implements OnInit, OnDestroy  {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string }
  ) {}

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
