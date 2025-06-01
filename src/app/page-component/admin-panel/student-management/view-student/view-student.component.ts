import { Component, Inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-student',
  imports: [],
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.css'
})
export class ViewStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    public dialogRef: MatDialogRef<ViewStudentComponent>,
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    console.log(this.data);
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
