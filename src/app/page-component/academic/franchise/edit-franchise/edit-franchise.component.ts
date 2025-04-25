import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { FranchiseDocumentName, Gender, ResponseTypeColor } from '../../../../constants/commonConstants';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../service/common/common.service';
import { IndexedDbService } from '../../../../service/indexed-db/indexed-db.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Dropdown } from '../../../../constants/commonConstants';
import { CustomMultiSelectDropdownComponent } from '../../../../common-component/custom-multi-select-dropdown/custom-multi-select-dropdown.component';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { TermsAndConditionsComponent } from '../../../../common-component/terms-and-conditions/terms-and-conditions.component';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-edit-franchise',
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CustomSingleSelectSearchableDropdownComponent,
    CustomMultiSelectDropdownComponent,
    MatProgressBarModule,
    TermsAndConditionsComponent
  ],
  templateUrl: './edit-franchise.component.html',
  styleUrl: './edit-franchise.component.css'
})
export class EditFranchiseComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);
  center_id: string = '';

  constructor(
    private commonService: CommonService,
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef,
    private indexedDbService: IndexedDbService,
    private route: ActivatedRoute
  ) { }

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  genderDropdownOption = Gender;
  selectedGenderDropdown: Dropdown | null = null;

  selectedStepIndex: number = 0;
  isLinear = false;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  CenterAddressStatus: boolean = false;
  AvilableCourseCategories: Dropdown[] = [];
  SelectedCourseCategories: Dropdown[] = [];
  AvilableCenterTypes: Dropdown[] = [];
  SelectedCenterType: Dropdown | null = null;

  OldCenterDetails: any = {};
  //#region Form Fields
  form1_visible: boolean = true;
  center_head_name: string = "";
  center_head_gender: string = "";
  center_head_contact_number: string = "";
  center_head_email_id: string = "";
  center_head_state: string = "";
  center_head_district: string = "";
  center_head_post_office: string = "";
  center_head_police_station: string = "";
  center_head_village_city: string = "";
  center_head_pin_code: string = "";

  form2_visible: boolean = true;
  center_name: string = "";
  center_contact_number: string = "";
  center_email_id: string = "";
  center_category: string[] = [];
  center_type: string = "";
  center_state: string = "";
  center_district: string = "";
  center_post_office: string = "";
  center_police_station: string = "";
  center_village_city: string = "";
  center_pin_code: string = "";

  center_head_photo: File | null = null;
  center_head_signature: File | null = null;
  supportable_document: File | null = null;

  terms_and_conditions_status: boolean = false;
  //#endregion 

  async ngOnInit() {
    this.activeMatProgressBar();
    this.center_id = this.route.snapshot.paramMap.get('center_id')!;

    this.setStepperOrientation();
    this.bootstrapElements = loadBootstrap();

    try {
      forkJoin({
        courseCategories: this.commonService.getAllAvailableCourseCategories(),
        centerTypes: this.commonService.getAllAvailableCenterTypes(),
        centerDetails: this.franchiseService.GetCenterDetails(this.center_id),
      }).subscribe({
        next: async ({ courseCategories, centerTypes, centerDetails }) => {
          courseCategories.data.forEach((element: any) => {
            this.AvilableCourseCategories.push(new Dropdown(element.course_code, element.course_name));
          });

          centerTypes.data.forEach((element: any) => {
            this.AvilableCenterTypes.push(new Dropdown(element.center_type_code, element.center_type_name));
          });

          this.OldCenterDetails = centerDetails.data[0];
          await this.AssignOldCenterDetails();
          await this.AssignOldCenterHeadDetails();
          this.hideMatProgressBar();
        },
        error: () => {
          this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
          this.hideMatProgressBar();
        }
      });
    } catch (error) {
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
      this.hideMatProgressBar();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setStepperOrientation();
  }

  setStepperOrientation() {
    this.stepperOrientation = window.innerWidth < 1200 ? 'vertical' : 'horizontal';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdFormGroup: ['', Validators.required],
  });
  forthFormGroup = this._formBuilder.group({
    forthFormGroup: ['', Validators.required],
  });

  async AssignOldCenterHeadDetails() {
    this.center_head_name = this.OldCenterDetails.center_head_name;
    this.center_head_gender = this.OldCenterDetails.center_head_gender;
    this.center_head_contact_number = this.OldCenterDetails.center_head_contact_number;
    this.center_head_email_id = this.OldCenterDetails.center_head_email_id;
    this.center_head_state = this.OldCenterDetails.center_state;
    this.center_head_district = this.OldCenterDetails.center_district;
    this.center_head_post_office = this.OldCenterDetails.center_post_office;
    this.center_head_police_station = this.OldCenterDetails.center_police_station;
    this.center_head_village_city = this.OldCenterDetails.center_village_city;
    this.center_head_pin_code = this.OldCenterDetails.center_pin_code;

    this.genderDropdownOption.forEach(item => {
      if (this.OldCenterDetails.center_head_gender === item.text) {
        this.selectedGenderDropdown = item;
      }
    });
  }

  async AssignOldCenterDetails() {
    this.center_name = this.OldCenterDetails.center_name;
    this.center_contact_number = this.OldCenterDetails.center_contact_number;
    this.center_email_id = this.OldCenterDetails.center_email_id;

    this.center_type = this.OldCenterDetails.center_type;
    this.center_state = this.OldCenterDetails.center_state;
    this.center_district = this.OldCenterDetails.center_district;
    this.center_post_office = this.OldCenterDetails.center_post_office;
    this.center_police_station = this.OldCenterDetails.center_police_station;
    this.center_village_city = this.OldCenterDetails.center_village_city;
    this.center_pin_code = this.OldCenterDetails.center_pin_code;

    this.SelectedCourseCategories = this.AvilableCourseCategories.filter(item =>
      this.OldCenterDetails.center_categories.includes(item.id)
    );

    this.AvilableCenterTypes.forEach(item => {
      if (this.OldCenterDetails.center_type === item.id) {
        this.SelectedCenterType = item;
      }
    });
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.selectedStepIndex = event.selectedIndex;
  }

  handleGenderSelection(event: any): void {
    this.center_head_gender = event.text;
  }

  onCheckboxChange(event: Event): void {
    this.CenterAddressStatus = (event.target as HTMLInputElement).checked;

    if (this.CenterAddressStatus === true) {
      this.center_state = this.center_head_state;
      this.center_district = this.center_head_district;
      this.center_post_office = this.center_head_post_office;
      this.center_police_station = this.center_head_police_station;
      this.center_village_city = this.center_head_village_city;
      this.center_pin_code = this.center_head_pin_code;
    } else {
      this.center_state = "";
      this.center_district = "";
      this.center_post_office = "";
      this.center_police_station = "";
      this.center_village_city = "";
      this.center_pin_code = "";
    }
  }

  handleSelectedCourses(selectedItems: Dropdown[]) {
    this.center_category = selectedItems.map((item: Dropdown) => item.id ?? "");
  }

  handleCenterTypeSelection(selectedItem: any) {
    this.center_type = selectedItem.id ?? "";
  }

  handleCenterHeadPhotoSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.center_head_photo = input.files[0];
    }
  }

  handleCenterHeadSignatureSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.center_head_signature = input.files[0];
    }
  }

  handleSupportableDocumentSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.supportable_document = input.files[0];
    }
  }

  reset_center_head_form() {
    this.center_head_name = "";
    this.center_head_gender = "";
    this.center_head_contact_number = "";
    this.center_head_email_id = "";
    this.center_head_state = "";
    this.center_head_district = "";
    this.center_head_post_office = "";
    this.center_head_police_station = "";
    this.center_head_village_city = "";
    this.center_head_pin_code = "";

    this.form1_visible = false;
    setTimeout(() => this.form1_visible = true);

    if (this.CenterAddressStatus) {
      this.center_state = "";
      this.center_district = "";
      this.center_post_office = "";
      this.center_police_station = "";
      this.center_village_city = "";
      this.center_pin_code = "";

      this.CenterAddressStatus = false;
    }

    this.AssignOldCenterHeadDetails();
  }

  reset_center_form() {
    this.center_name = "";
    this.center_contact_number = "";
    this.center_email_id = "";
    this.center_category = [];
    this.center_type = "";
    this.center_state = "";
    this.center_district = "";
    this.center_post_office = "";
    this.center_police_station = "";
    this.center_village_city = "";
    this.center_pin_code = "";

    this.CenterAddressStatus = false;

    this.form2_visible = false;
    setTimeout(() => this.form2_visible = true);

    this.AssignOldCenterDetails();
  }

  reset_document_form(CenterHeadPhotoInput: HTMLInputElement, CenterHeadSignatureInput: HTMLInputElement, SupportableDocumentInput: HTMLInputElement) {
    this.center_head_photo = null;
    this.center_head_signature = null;
    this.supportable_document = null;

    CenterHeadPhotoInput.value = '';
    CenterHeadSignatureInput.value = '';
    SupportableDocumentInput.value = '';
  }

  TermsAndConditionStatus(status: boolean) {
    this.terms_and_conditions_status = status;
  }

  async submit() {
    try {
      const isValid = await this.validateForm();
      if (!isValid) return;

      this.activeMatProgressBar();

      // Center head save
      const center_head = await this.saveCenterHeadDetails();

      // Center details save
      const center = await this.saveCenterDetails(center_head.data);

      // Center supportive documents save
      const formData = new FormData();
      formData.append("center_id", center.data[0].center_id);
      formData.append("document_info", JSON.stringify([
        { fileName: FranchiseDocumentName.CENTER_HEAD_PHOTO },
        { fileName: FranchiseDocumentName.CENTER_HEAD_SIGNATURE },
        { fileName: FranchiseDocumentName.SUPPORTABLE_DOCUMENT }
      ]));

      if (this.center_head_photo) {
        formData.append("files", this.center_head_photo);
      }
      if (this.center_head_signature) {
        formData.append("files", this.center_head_signature);
      }
      if (this.supportable_document) {
        formData.append("files", this.supportable_document);
      }

      await this.saveCenterSupportiveDocumentDetails(formData);

      this.hideMatProgressBar();
      this.openDialog(
        "Franchise",
        "Thank You for successfully registering yourself as our franchise.<br>Please wait for the admin approval.",
        ResponseTypeColor.SUCCESS,
        false
      );
    } catch (error: any) {
      this.hideMatProgressBar();
      const message = error?.error?.message || "Internal server error";
      this.openDialog("Franchise", message, ResponseTypeColor.ERROR, false);
      return;
    }
  }


  async validateForm() {
    // Center Head Validation
    this.center_head_name = this.center_head_name.trim();
    if (this.center_head_name === "") {
      this.openDialog("Franchise", "Center Head Name is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_head_gender === "") {
      this.openDialog("Franchise", "Center Head Gender is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_head_contact_number === "") {
      this.openDialog("Franchise", "Center Head Contact Number is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_email_id = this.center_head_email_id.trim();
    if (this.center_head_email_id === "") {
      this.openDialog("Franchise", "Center Head Email ID is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_state = this.center_head_state.trim();
    if (this.center_head_state === "") {
      this.openDialog("Franchise", "Center Head State is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_district = this.center_head_district.trim();
    if (this.center_head_district === "") {
      this.openDialog("Franchise", "Center Head District is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_post_office = this.center_head_post_office.trim();
    if (this.center_head_post_office === "") {
      this.openDialog("Franchise", "Center Head Post Office is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_police_station = this.center_head_police_station.trim();
    if (this.center_head_police_station === "") {
      this.openDialog("Franchise", "Center Head Police Station is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_head_village_city = this.center_head_village_city.trim();
    if (this.center_head_village_city === "") {
      this.openDialog("Franchise", "Center Head Village/City is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_head_pin_code === "") {
      this.openDialog("Franchise", "Center Head Pin Code is required", ResponseTypeColor.INFO, false);
      return false;
    }

    // Center Validation
    this.center_name = this.center_name.trim();
    if (this.center_name === "") {
      this.openDialog("Franchise", "Center Name is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_contact_number === "") {
      this.openDialog("Franchise", "Center Contact Number is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_email_id = this.center_email_id.trim();
    if (this.center_email_id === "") {
      this.openDialog("Franchise", "Center Email ID is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_category.length === 0) {
      this.openDialog("Franchise", "Center Category is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_type === "") {
      this.openDialog("Franchise", "Center Type is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_state === "") {
      this.openDialog("Franchise", "Center State is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_district = this.center_district.trim();
    if (this.center_district === "") {
      this.openDialog("Franchise", "Center District is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_post_office = this.center_post_office.trim();
    if (this.center_post_office === "") {
      this.openDialog("Franchise", "Center Post Office is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_police_station = this.center_police_station.trim();
    if (this.center_police_station === "") {
      this.openDialog("Franchise", "Center Police Station is required", ResponseTypeColor.INFO, false);
      return false;
    }

    this.center_village_city = this.center_village_city.trim();
    if (this.center_village_city === "") {
      this.openDialog("Franchise", "Center Village/City is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (this.center_pin_code === "") {
      this.openDialog("Franchise", "Center Pin Code is required", ResponseTypeColor.INFO, false);
      return false;
    }

    // Supportable Document Validation
    if (!this.center_head_photo || this.center_head_photo === null) {
      this.openDialog("Franchise", "Center Head Photo is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (!this.center_head_signature || this.center_head_signature === null) {
      this.openDialog("Franchise", "Center Head Signature is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (!this.supportable_document || this.supportable_document === null) {
      this.openDialog("Franchise", "Supportable Document is required", ResponseTypeColor.INFO, false);
      return false;
    }

    return true;
  }

  async saveCenterHeadDetails(): Promise<any> {
    const center_head_details = {
      center_head_name: this.center_head_name,
      center_head_gender: this.center_head_gender,
      center_head_contact_number: this.center_head_contact_number,
      center_head_email_id: this.center_head_email_id,
      center_head_state: this.center_head_state,
      center_head_district: this.center_head_district,
      center_head_post_office: this.center_head_post_office,
      center_head_police_station: this.center_head_police_station,
      center_head_village_city: this.center_head_village_city,
      center_head_pin_code: this.center_head_pin_code
    };

    return new Promise((resolve, reject) => {
      this.franchiseService.AddCenterHead(center_head_details).subscribe({
        next: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  async saveCenterDetails(center_head: any): Promise<any> {
    const center_details = {
      center_head_id: center_head[0].center_head_id,
      center_name: this.center_name,
      center_contact_number: this.center_contact_number,
      center_email_id: this.center_email_id,
      center_category: this.center_category,
      center_type: this.center_type,
      center_state: this.center_state,
      center_district: this.center_district,
      center_post_office: this.center_post_office,
      center_police_station: this.center_police_station,
      center_village_city: this.center_village_city,
      center_pin_code: this.center_pin_code
    };

    return new Promise((resolve, reject) => {
      this.franchiseService.AddCenter(center_details).subscribe({
        next: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  async saveCenterSupportiveDocumentDetails(formData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.franchiseService.UploadFranchiseDocument(formData).subscribe({
        next: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}

