import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { FormGroup, FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';
import { Dropdown, Gender, MaritalStatus, ResponseTypeColor } from '../../../../constants/commonConstants';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TermsAndConditionsComponent } from '../../../../common-component/terms-and-conditions/terms-and-conditions.component';
import { StudentService } from '../../../../service/student/student.service';

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
    private studentService: StudentService,
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

  form1_visible: boolean = true;
  student_name: string = '';
  student_Adhar_number: number | null = null;
  student_DOB: Date | null = null;
  student_maratial_status: string = '';
  student_gender: string = '';
  student_email: string = '';
  student_phone_no: number | null = null;
  student_whats_app: number | null = null

  student_fathers_name: string = '';
  student_mothers_name: string = '';
  student_husbands_name: string = '';
  student_wifes_name: string = '';
  student_guardians_number: number | null = null;

  student_state: string = '';
  student_district: string = '';
  student_post_office: string = '';
  student_village_city: string = '';
  student_pincode: number | null = null;

  terms_and_conditions_status: boolean = false;

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.setStepperOrientation();
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

  reset_basic_details_form() {
    this.student_name = '';
    this.student_Adhar_number = null;
    this.student_DOB = null;
    this.student_maratial_status = '';
    this.student_gender = '';
    this.student_email = '';
    this.student_phone_no = null;
    this.student_whats_app = null;

    this.form1_visible = false;
    setTimeout(() => this.form1_visible = true);
  }

  reset_family_details_form() {
    this.student_fathers_name = '';
    this.student_mothers_name = '';
    this.student_husbands_name = '';
    this.student_wifes_name = '';
    this.student_guardians_number = null;
  }

  reset_address_form() {
    this.student_state = '';
    this.student_district = '';
    this.student_post_office = '';
    this.student_village_city = '';
    this.student_pincode = null;
  }

  submit() {
    const obj = {
      student_name: this.student_name,
      student_Adhar_number: this.student_Adhar_number,
      student_DOB: this.student_DOB,
      student_maratial_status: this.student_maratial_status,
      student_gender: this.student_gender,
      student_email: this.student_email,
      student_phone_no: this.student_phone_no,
      student_whats_app: this.student_whats_app,
      student_fathers_name: this.student_fathers_name,
      student_mothers_name: this.student_mothers_name,
      student_husbands_name: this.student_husbands_name,
      student_wifes_name: this.student_wifes_name,
      student_guardians_number: this.student_guardians_number,
      student_state: this.student_state,
      student_district: this.student_district,
      student_post_office: this.student_post_office,
      student_village_city: this.student_village_city,
      student_pincode: this.student_pincode,
    }

    this.activeMatProgressBar();

    this.studentService.CreateStudent(obj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.hideMatProgressBar();
          this.openDialog("Student", response.message, ResponseTypeColor.SUCCESS, null);
          // will redirect to student manage panel
          return;
        }

        this.hideMatProgressBar();
        this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  isNotValid() {
    return (this.terms_and_conditions_status === false || this.student_name === '' || this.student_Adhar_number === null || this.student_DOB === null ||
      this.student_maratial_status === '' || this.student_gender === '' || this.student_email === '' || this.student_phone_no === null ||
      this.student_guardians_number === null || this.student_state === '' || this.student_district === '' || this.student_post_office === '' ||
      this.student_village_city === '' || this.student_pincode === null);
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
