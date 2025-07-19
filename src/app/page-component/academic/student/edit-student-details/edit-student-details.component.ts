import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomDatePickerComponent } from '../../../../common-component/custom-date-picker/custom-date-picker.component';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';

import { Dropdown, Gender, MaritalStatus, ResponseTypeColor, StudentDocumentName, UserRole } from '../../../../constants/commonConstants';
import { StudentService } from '../../../../service/student/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-student-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatStepperModule,
    CustomDatePickerComponent,
    CustomSingleSelectSearchableDropdownComponent,
    ImageCropperComponent
  ],
  templateUrl: './edit-student-details.component.html',
  styleUrl: './edit-student-details.component.css'
})
export class EditStudentDetailsComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
    private authService: AuthService,
    private franchiseService: FranchiseService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);

  matProgressBarVisible = false;
  matProgressBarVisible1 = false;

  selectedStepIndex = 0;
  isLinear = false;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  UserRole = UserRole;
  userRole: string | null = null;

  student_id: string | null = null;

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

  student_details_old: any | null = null;

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
  selectedStudentMaritalStatus: Dropdown | null = null;
  student_marital_status = '';
  selectedGender: Dropdown | null = null;
  student_gender = '';
  student_email = '';
  student_phone_no: number | null = null;
  student_whats_app: number | null = null;
  selectedCourse: Dropdown | null = null;
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

  aadhar_card_photo: File | null = null;

  displayProperty: boolean = false;
  imageChangedEvent: Event | null = null;
  croppedImage: any | null = null;
  student_photo: File | null = null;
  student_photo_extension: string | null = null;

  async ngOnInit() {
    this.student_id = this.route.snapshot.paramMap.get('student_id');
    this.bootstrapElements = loadBootstrap();
    this.setStepperOrientation();
    this.activeMatProgressBar();

    this.userRole = this.authService.getUserRole();

    if (this.userRole === UserRole.FRANCHISE) {
      let userId = this.authService.getUserId();

      this.franchiseService.GetFranchiseIdByUserId(userId).subscribe({
        next: async (response) => {
          this.associated_franchise_id = response.data[0];

          this.franchiseService.getAllAvailableSubCourseByFranchise(this.associated_franchise_id).subscribe({
            next: async (response1) => {
              response1.data.forEach((element: any) => {
                this.available_sub_course_categories.push(new Dropdown(element.course_code, element.course_name));
              });

              this.getStudentDetails();
              this.hideMatProgressBar();
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, null);
            }
          });
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, null);
        }
      });
    } else if (this.userRole === UserRole.MASTER || this.userRole === UserRole.ADMIN) {
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
      this.hideMatProgressBar();

      if (res.status !== 200) {
        this.openDialog("Student", res.message, ResponseTypeColor.ERROR, null);
        return;
      }

      this.available_franchises_with_sub_course_info = res.data;

      res.data.forEach((element: any) => {
        this.available_franchises.push(new Dropdown(element.id, element.center_name));
      });

      this.getStudentDetails();
    } else {
      this.hideMatProgressBar();
      this.openDialog("Student", "You are not authorized to access this page", ResponseTypeColor.ERROR, "/home");
    }
  }

  getStudentDetails() {
    this.activeMatProgressBar1();

    this.studentService.getStudentInfoById(this.student_id).subscribe({
      next: (response) => {
        if (response.status !== 200) {
          this.hideMatProgressBar1();
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
          return;
        }

        this.student_details_old = response.data[0];

        this.student_name = response.data[0].student.student_name;
        this.student_Adhar_number = response.data[0].student.student_Adhar_number;
        this.student_DOB = new Date(response.data[0].student.student_DOB);
        this.student_marital_status = response.data[0].student.student_maratial_status;
        this.student_gender = response.data[0].student.student_gender;
        this.student_email = response.data[0].student.student_email;
        this.student_phone_no = response.data[0].student.student_phone_no;
        this.student_whats_app = response.data[0].student.student_whats_app;
        this.enrolled_courses = response.data[0].student.enrolled_courses_list;
        this.student_fathers_name = response.data[0].student.student_fathers_name;
        this.student_mothers_name = response.data[0].student.student_mothers_name;
        this.student_husbands_name = response.data[0].student.student_husbands_name;
        this.student_wifes_name = response.data[0].student.student_wifes_name;
        this.student_guardians_number = response.data[0].student.student_guardians_number;
        this.student_state = response.data[0].student.student_state;
        this.student_district = response.data[0].student.student_district;
        this.student_post_office = response.data[0].student.student_post_office;
        this.student_village_city = response.data[0].student.student_village_city;
        this.student_pincode = response.data[0].student.student_pincode;

        this.updateDropdownsByDefaultValues(response.data[0]);
        this.hideMatProgressBar1();
      },
      error: (err) => {
        this.hideMatProgressBar1();
        this.openDialog("Student", err.error.message || "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  updateDropdownsByDefaultValues(student_data: any) {
    for (let i = 0; i < this.marital_status_option.length; i++) {
      if (this.marital_status_option[i].text?.toString().toUpperCase() === student_data.student.student_maratial_status) {
        this.selectedStudentMaritalStatus = this.marital_status_option[i];
        break;
      }
    }

    for (let i = 0; i < this.gender_option.length; i++) {
      if (this.gender_option[i].text?.toString().toUpperCase() === student_data.student.student_gender) {
        this.selectedGender = this.gender_option[i];
        break;
      }
    }

    if (this.userRole === UserRole.MASTER || this.userRole === UserRole.ADMIN) {
      const temp_franchise = new Dropdown(student_data.student.associated_franchise_id, student_data.franchise_name);
      this.handleFranchiseSelection(temp_franchise);

      const selectedFranchise = this.available_franchises_with_sub_course_info.find(item => item.id === temp_franchise.id);
      let temp_course = selectedFranchise.sub_course_category.map((item: any) => new Dropdown(item.course_code, item.course_name));

      for (let i = 0; i < temp_course.length; i++) {
        if (temp_course[i].id?.toString() === student_data.student.enrolled_courses_list[0]) {
          this.selectedCourse = temp_course[i];
          break;
        }
      }
    } else if (this.userRole === UserRole.FRANCHISE) {
      for (let i = 0; i < this.available_sub_course_categories.length; i++) {
        if (this.available_sub_course_categories[i].id?.toString() === student_data.student.enrolled_courses_list[0]) {
          this.selectedCourse = this.available_sub_course_categories[i];
          break;
        }
      }
    }

    this.form1_visible = false;
    setTimeout(() => (this.form1_visible = true));
    this.sub_course_form_visible = false;
    setTimeout(() => (this.sub_course_form_visible = true));
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
    this.selectedStudentMaritalStatus = event;
    this.student_marital_status = event.text.toUpperCase();
  }

  handleGenderSelection(event: any): void {
    this.student_gender = event.text.toUpperCase();
  }

  handleFranchiseSelection(selectedItem: Dropdown | any) {
    let franchise = selectedItem.id ?? "";
    const selectedFranchise = this.available_franchises_with_sub_course_info.find(item => item.id === franchise);
    this.associated_franchise_id = selectedFranchise.id;

    this.available_sub_course_categories = selectedFranchise.sub_course_category.map((item: any) => new Dropdown(item.course_code, item.course_name));
  }

  handleSelectedSubCourses(item: Dropdown | any) {
    this.enrolled_courses = [];
    this.enrolled_courses.push(item.id ?? "");
  }

  handleAadharSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.aadhar_card_photo = input.files[0];
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    } else {
      this.croppedImage = null;
    }

    const imgElement = document.getElementById("croppedStudentPassportSizePhoto") as HTMLImageElement;

    if (!imgElement || !imgElement.src) {
      this.openDialog("Student", "Please select an image", ResponseTypeColor.INFO, null);
      return;
    }

    fetch(imgElement.src)
      .then(res => res.blob())
      .then(blob => {
        const mimeType = blob.type; // e.g., "image/jpeg"
        const extensionMap: { [key: string]: string } = {
          "image/jpeg": ".jpg",
          "image/jpg": ".jpg",
          "image/png": ".png",
          "image/webp": ".webp",
          "image/gif": ".gif",
          "image/bmp": ".bmp"
        };

        const extension = extensionMap[mimeType] || '';
        this.student_photo_extension = extension;

        const file = new File([blob], `croppedImage${extension}`, { type: mimeType });
        this.student_photo = file;
      });
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  resetCroppedImage() {
    this.croppedImage = null;
    this.displayProperty = false;
  }

  handleStudentPhotoSelected(event: any) {
    this.imageChangedEvent = event;
    this.displayProperty = true;
  }

  reset_basic_details_form() {
    this.student_name = this.student_details_old.student.student_name;
    this.student_Adhar_number = this.student_details_old.student.student_Adhar_number;
    this.student_DOB = new Date(this.student_details_old.student.student_DOB);
    this.student_marital_status = this.student_details_old.student.student_maratial_status;
    this.student_gender = this.student_details_old.student.student_gender;
    this.student_email = this.student_details_old.student.student_email;
    this.student_phone_no = this.student_details_old.student.student_phone_no;
    this.student_whats_app = this.student_details_old.student.student_whats_app;
    this.enrolled_courses = this.student_details_old.student.enrolled_courses_list;

    this.updateDropdownsByDefaultValues(this.student_details_old);
  }

  reset_family_details_form() {
    this.student_fathers_name = this.student_details_old.student.student_fathers_name;
    this.student_mothers_name = this.student_details_old.student.student_mothers_name;
    this.student_husbands_name = this.student_details_old.student.student_husbands_name;
    this.student_wifes_name = this.student_details_old.student.student_wifes_name;
    this.student_guardians_number = this.student_details_old.student.student_guardians_number;
  }

  reset_address_form() {
    this.student_state = this.student_details_old.student.student_state;
    this.student_district = this.student_details_old.student.student_district;
    this.student_post_office = this.student_details_old.student.student_post_office;
    this.student_village_city = this.student_details_old.student.student_village_city;
    this.student_pincode = this.student_details_old.student.student_pincode;
  }

  reset_document_form(AadharPhotoInput: HTMLInputElement, StudentSignatureInput: HTMLInputElement) {
    this.aadhar_card_photo = null;
    this.student_photo = null;;

    this.resetCroppedImage();

    AadharPhotoInput.value = '';
    StudentSignatureInput.value = '';
  }

  async submit() {
    const formData = new FormData();

    formData.append("document_info", JSON.stringify([
      { fileName: StudentDocumentName.AADHAR_CARD_PHOTO },
      { fileName: StudentDocumentName.PASSPORT_SIZED_PHOTO },
    ]));

    if (this.aadhar_card_photo) {
      formData.append("files", this.aadhar_card_photo);
    }
    // if (this.student_photo) {
    //   formData.append("files", this.student_photo);
    // }

    // Fetch blob from SafeUrl for cropped image
    const blobUrl = this.croppedImage['changingThisBreaksApplicationSecurity'];

    const blob = await fetch(blobUrl).then(res => res.blob());
    const studentPhotoFile = new File([blob], StudentDocumentName.PASSPORT_SIZED_PHOTO, { type: blob.type });

    formData.append('files', studentPhotoFile);

    this.activeMatProgressBar();

    this.studentService.UploadStudentDocument(formData).subscribe({
      next: (response1) => {
        if (response1.status === 200) {
          const payload = {
            student_name: this.student_name,
            // Convert number fields to strings
            student_guid: response1.data[0].student_guid,
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
            aadhar_card_uploaded: response1.data[0].aadhar_card_uploaded,
            student_photo_uploaded: response1.data[0].student_photo_uploaded,
            passport_sized_photo_extension: ".jpg" //this.student_photo_extension
          };

          this.studentService.CreateStudent(payload).subscribe({
            next: (response) => {
              this.hideMatProgressBar();

              if (response.status === 200) {
                this.openDialog('Student', response.message, ResponseTypeColor.SUCCESS, "control-panel/manage-student/active-student");
              } else {
                this.openDialog('Student', response.message, ResponseTypeColor.ERROR, null);
              }
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Student", err.error.message || "Internal server error", ResponseTypeColor.ERROR, null);
            }
          });
        } else {
          this.hideMatProgressBar();
          this.openDialog('Student', response1.message, ResponseTypeColor.ERROR, null);
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
      this.enrolled_courses.length === 0 ||
      !this.aadhar_card_photo ||
      !this.student_photo
    );
  }

  setStepperOrientation() {
    this.stepperOrientation = window.innerWidth < 1200 ? 'vertical' : 'horizontal';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar1() {
    this.matProgressBarVisible1 = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar1() {
    this.matProgressBarVisible1 = false;
    this.cdr.detectChanges();
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
