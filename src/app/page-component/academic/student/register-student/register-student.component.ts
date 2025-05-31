import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';

@Component({
  selector: 'app-register-student',
  imports: [CommonModule, FormsModule, MatProgressBarModule, CustomDatePickerComponent],
  standalone: true,
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css',
})
export class RegisterStudentComponent {
  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);


  student_name: string = '';
  student_DOB: Date = new Date();

  someDate: Date = this.getTwoDaysBefore();

  getTwoDaysBefore(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return d;
  }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  onDateSelected(date: Date) {
    console.log('Selected date:', date);
  }

  submit() {

  }

  isValid() {
    return true;
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
