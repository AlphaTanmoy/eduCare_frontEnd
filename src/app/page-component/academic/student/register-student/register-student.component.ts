import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { FormGroup, FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';
import { Dropdown, Gender, MaritalStatus } from '../../../../constants/commonConstants';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TermsAndConditionsComponent } from '../../../../common-component/terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-register-student',
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    CustomDatePickerComponent,
    CustomSingleSelectSearchableDropdownComponent,
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    TermsAndConditionsComponent
  ],
  standalone: true,
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css',
})
export class RegisterStudentComponent {
  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  selectedStepIndex: number = 0;
  isLinear = false;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  forthFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });


  marital_status_option: Dropdown[] = MaritalStatus;
  gender_option: Dropdown[] = Gender;

  student_name: string = '';
  student_Adhar_number: string = '';
  student_DOB: Date | null = null;
  student_maratial_status: string = '';
  student_gender: string = '';
  student_email: string = '';
  student_phone_no: string = '';
  student_whats_app: string = '';

  student_fathers_name: string = '';
  student_mothers_name: string = '';
  student_husbands_name: string = '';
  student_wifes_name: string = '';
  student_guardians_number: number | null = null;

  student_state: string = '';
  student_district: string = '';
  student_post_office: string = '';
  student_village_city: string = '';
  student_pincode: string = '';

  terms_and_conditions_status: boolean = false;

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setStepperOrientation();
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
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

  TermsAndConditionStatus(status: boolean) {
    this.terms_and_conditions_status = status;
  }

  submit() {

  }

  isValid() {
    return true;
  }

  setStepperOrientation() {
    this.stepperOrientation = window.innerWidth < 1200 ? 'vertical' : 'horizontal';
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
