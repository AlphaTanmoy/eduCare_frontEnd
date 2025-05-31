import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';
import { Dropdown, Gender, MaritalStatus } from '../../../../constants/commonConstants';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';

@Component({
  selector: 'app-register-student',
  imports: [CommonModule, FormsModule, MatProgressBarModule, CustomDatePickerComponent, CustomSingleSelectSearchableDropdownComponent],
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

  marital_status_option: Dropdown[] = MaritalStatus;
  gender_option: Dropdown[] = Gender;

  student_name: string = '';
  student_Adhar_number: string = '';
  student_DOB: Date | null = null;
  student_maratial_status: string = '';
  student_gender: string = '';

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  onDobSelected(date: Date) {
    console.log('Selected date:', date);
    this.student_DOB = date;
  }

  handleMaritalStatusSelection(event: any): void {
    this.student_maratial_status = event.text;
  }

  handleGenderSelection(event: any): void {
    this.student_gender = event.text;
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
