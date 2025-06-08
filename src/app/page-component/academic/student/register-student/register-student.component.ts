import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Router } from '@angular/router';

import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { TermsAndConditionsComponent } from '../../../../common-component/terms-and-conditions/terms-and-conditions.component';

import { Dropdown, Gender, MaritalStatus, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
import { StudentService } from '../../../../service/student/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonService } from '../../../../service/common/common.service';
import { CustomMultiSelectDropdownComponent } from '../../../../common-component/custom-multi-select-dropdown/custom-multi-select-dropdown.component';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-student',
  standalone: true,
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatStepperModule,
    CustomDatePickerComponent,
    CustomSingleSelectSearchableDropdownComponent,
    TermsAndConditionsComponent,
    CustomMultiSelectDropdownComponent
  ],
})

export class RegisterStudentComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
    private authService: AuthService,
    private franchiseService: FranchiseService,
    private router: Router,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);

  matProgressBarVisible = false;

  selectedStepIndex = 0;
  isLinear = false;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  UserRole = UserRole;
  userRole: string | null = null;

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

  available_franchises_with_sub_course_info: any[] = [];
  available_franchises: Dropdown[] = [];
  available_sub_course_categories: Dropdown[] = [];
  marital_status_option: Dropdown[] = MaritalStatus;
  gender_option: Dropdown[] = Gender;

  form1_visible = true;
  sub_course_form_visible = true;
  associated_franchise_id: string | null = null;

  student_name = '';
  student_Adhar_number: number | null = null;
  student_DOB: Date | null = null;
  student_marital_status = '';
  student_gender = '';
  student_email = '';
  student_phone_no: number | null = null;
  student_whats_app: number | null = null;
  enrolled_courses: string[] = [];

  student_fathers_name = '';
  student_mothers_name = '';
  student_husbands_name = '';
  student_wifes_name = '';
  student_guardians_number: number | null = null;

  student_state = '';
  student_district = '';
  student_post_office = '';
  student_village_city = '';
  student_pincode: number | null = null;

  terms_and_conditions_status = false;

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.setStepperOrientation();
    this.activeMatProgressBar();

    this.userRole = this.authService.getUserRole();
    debugger
    if (this.userRole === UserRole.FRANCHISE) {
      let userId = this.authService.getUserId();

      this.franchiseService.GetFranchiseIdByUserId(userId).subscribe({
        next: async (response) => {
          console.log(response)
          this.associated_franchise_id = response.data[0];

          this.franchiseService.getAllAvailableSubCourseByFranchise(userId).subscribe({
            next: async (response1) => {
              response1.data.forEach((element: any) => {
                this.available_sub_course_categories.push(new Dropdown(element.course_code, element.course_name));
              });
              this.hideMatProgressBar();
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, null);
            }
          });
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, null);
        }
      });
    } else if (this.userRole === UserRole.MASTER || this.userRole === UserRole.ADMIN) {
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
      this.hideMatProgressBar();

      if (res.status !== 200) {
        this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, null);
        return;
      }

      this.available_franchises_with_sub_course_info = res.data;

      res.data.forEach((element: any) => {
        this.available_franchises.push(new Dropdown(element.id, element.center_name));
      });
    } else {
      this.hideMatProgressBar();
      this.openDialog("Franchise", "You are not authorized to access this page", ResponseTypeColor.ERROR, "/home");
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.setStepperOrientation();
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
  }

  onDobSelected(date: Date) {
    this.student_DOB = date;
  }

  handleMaritalStatusSelection(event: any): void {
    this.student_marital_status = event.text.toUpperCase();
  }

  handleGenderSelection(event: any): void {
    this.student_gender = event.text.toUpperCase();
  }

  handleFranchiseSelection(selectedItem: any) {
    let franchise = selectedItem.id ?? "";
    const selectedFranchise = this.available_franchises_with_sub_course_info.find(item => item.id === franchise);
    this.associated_franchise_id = selectedFranchise.id;

    this.available_sub_course_categories = selectedFranchise.sub_course_category.map((item: any) => new Dropdown(item.course_code, item.course_name));
    this.cdr.detectChanges();

    this.sub_course_form_visible = false;
    setTimeout(() => (this.sub_course_form_visible = true));
  }

  handleSelectedSubCourses(selectedItems: Dropdown[]) {
    this.enrolled_courses = selectedItems.map((item: Dropdown) => item.id ?? "");
  }

  TermsAndConditionStatus(status: boolean) {
    this.terms_and_conditions_status = status;
  }

  reset_basic_details_form() {
    this.student_name = '';
    this.student_Adhar_number = null;
    this.student_DOB = null;
    this.student_marital_status = '';
    this.student_gender = '';
    this.student_email = '';
    this.student_phone_no = null;
    this.student_whats_app = null;
    this.enrolled_courses = [];

    this.form1_visible = false;
    setTimeout(() => (this.form1_visible = true));
    this.sub_course_form_visible = false;
    setTimeout(() => (this.sub_course_form_visible = true));
    this.available_sub_course_categories = [];
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
    const payload = {
      student_name: this.student_name,
      // Convert number fields to strings
      associated_franchise_id: this.associated_franchise_id,
      student_Adhar_number: this.student_Adhar_number?.toString() || '',
      student_DOB: this.student_DOB,
      student_marital_status: this.student_marital_status,
      student_gender: this.student_gender,
      student_email: this.student_email,
      student_phone_no: this.student_phone_no?.toString() || '',
      student_whats_app: this.student_whats_app?.toString() || null,
      enrolled_courses: this.enrolled_courses,
      student_fathers_name: this.student_fathers_name,
      student_mothers_name: this.student_mothers_name,
      student_husbands_name: this.student_husbands_name,
      student_wifes_name: this.student_wifes_name,
      student_guardians_number: this.student_guardians_number?.toString() || '',
      student_state: this.student_state,
      student_district: this.student_district,
      student_post_office: this.student_post_office,
      student_village_city: this.student_village_city,
      student_pincode: this.student_pincode?.toString() || '',
    };

    this.activeMatProgressBar();

    this.studentService.CreateStudent(payload).subscribe({
      next: (response) => {
        this.hideMatProgressBar();
        if (response.status === 200) {
          this.openDialog('Student', response.message, ResponseTypeColor.SUCCESS, null);
        } else {
          this.openDialog('Student', response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message || "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  isNotValid(): boolean {
    return (
      !this.terms_and_conditions_status ||
      !this.student_name ||
      !this.student_Adhar_number ||
      !this.student_DOB ||
      !this.student_marital_status ||
      !this.student_gender ||
      !this.student_phone_no ||
      !this.student_guardians_number ||
      !this.student_state ||
      !this.student_district ||
      !this.student_post_office ||
      !this.student_village_city ||
      !this.student_pincode ||
      this.enrolled_courses.length === 0
    );
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
        this.router.navigate([navigateRoute]);
      }
    });
  }
}
