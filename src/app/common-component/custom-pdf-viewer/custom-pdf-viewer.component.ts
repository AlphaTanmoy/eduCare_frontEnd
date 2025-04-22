import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-custom-pdf-viewer',
  imports: [PdfViewerModule],
  templateUrl: './custom-pdf-viewer.component.html',
  styleUrl: './custom-pdf-viewer.component.css'
})
export class CustomPdfViewerComponent {
  pdf_url: any;
  filename: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pdf_url: Blob; filename: string },
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.pdf_url = this.data.pdf_url;
    this.filename = this.data.filename;
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
