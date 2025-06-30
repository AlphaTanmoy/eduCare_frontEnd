import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAlertComponent implements OnInit, OnDestroy {
  // Make the enum available in template
  ResponseTypeColor = ResponseTypeColor;
  textColorClass: string = 'text-success';
  formattedText: string = '';
  buttonClass: string = 'alert-button success'; // Default class

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string; type: ResponseType },
    private dialogRef: MatDialogRef<CustomAlertComponent>,
    private cdr: ChangeDetectorRef
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.formattedText = this.data.text.replace(/\n/g, '<br>');
    
    // Set classes based on alert type
    switch (this.data.type) {
      case ResponseTypeColor.WARNING:
        this.textColorClass = 'text-warning';
        this.buttonClass = 'btn btn-warning m-3';
        break;
      case ResponseTypeColor.INFO:
        this.textColorClass = 'text-primary';
        this.buttonClass = 'btn btn-primary m-3';
        break;
      case ResponseTypeColor.ERROR:
        this.textColorClass = 'text-danger';
        this.buttonClass = 'btn btn-danger m-3';
        break;
      default:
        this.textColorClass = 'text-success';
        this.buttonClass = 'btn btn-success m-3';
    }
    
    // Trigger change detection
    this.cdr.markForCheck();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }
}
