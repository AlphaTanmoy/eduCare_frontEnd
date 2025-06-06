import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, HostListener, ViewChild, ElementRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { ActiveInactiveStatus, FranchiseDocumentName, Gender, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
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
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { convertBlobToBase64 } from '../../../../utility/common-util';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../../service/auth/Auth.Service';

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
    FontAwesomeModule
  ],
  templateUrl: './edit-franchise.component.html',
  styleUrl: './edit-franchise.component.css'
})

export class EditFranchiseComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);
  center_id: string = '';
  FranchiseDocumentName = FranchiseDocumentName;

  @ViewChild('CenterHeadPhotoInput') CenterHeadPhotoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('CenterHeadSignatureInput') CenterHeadSignatureInput!: ElementRef<HTMLInputElement>;
  @ViewChild('SupportableDocumentInput') SupportableDocumentInput!: ElementRef<HTMLInputElement>;

  faDownload = faDownload;

  constructor(
    private commonService: CommonService,
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef,
    private indexedDbService: IndexedDbService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  genderDropdownOption = Gender;
  selectedGenderDropdown: Dropdown | null = null;

  selectedStepIndex: number = 0;
  isLinear = false;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  ActiveInactiveStatus = ActiveInactiveStatus;

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
  center_head_id: string = "";
  center_name: string = "";
  center_user_id: string = "";
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
  center_data_status: string = "";

  user_role: string = "COMMON";
  UserRole = UserRole;

  OldCenterDocuments = {
    [FranchiseDocumentName.CENTER_HEAD_PHOTO]: "",
    [FranchiseDocumentName.CENTER_HEAD_SIGNATURE]: "",
    [FranchiseDocumentName.SUPPORTABLE_DOCUMENT]: ""
  };

  has_center_head_photo: boolean = false;
  has_center_head_signature: boolean = false;
  has_supportable_document: boolean = false;

  center_head_photo_new: File | null = null;
  center_head_signature_new: File | null = null;
  supportable_document_new: File | null = null;
  //#endregion

  async ngOnInit() {
    this.activeMatProgressBar();
    this.user_role = this.authService.getUserRole();
    this.center_id = this.route.snapshot.paramMap.get('center_id')!;

    this.setStepperOrientation();
    this.bootstrapElements = loadBootstrap();

    try {
      forkJoin({
        courseCategories: this.commonService.getAllAvailableCourseCategories(),
        centerTypes: this.commonService.getAllAvailableCenterTypes(),
        centerDetails: this.franchiseService.GetCenterDetails(this.center_id),
        centerDocumentsInfo: this.franchiseService.GetCenterDocumeentsInfo(this.center_id),
        centerHeadPhoto: this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.CENTER_HEAD_PHOTO),
        centerHeadSignature: this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.CENTER_HEAD_SIGNATURE),
        supportableDocument: this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.SUPPORTABLE_DOCUMENT),
      }).subscribe({
        next: async ({ courseCategories, centerTypes, centerDetails, centerDocumentsInfo, centerHeadPhoto, centerHeadSignature, supportableDocument }) => {
          courseCategories.data.forEach((element: any) => {
            this.AvilableCourseCategories.push(new Dropdown(element.course_code, element.course_name));
          });

          centerTypes.data.forEach((element: any) => {
            this.AvilableCenterTypes.push(new Dropdown(element.center_type_code, element.center_type_name));
          });

          this.OldCenterDetails = centerDetails.data[0];
          await this.AssignOldCenterDetails();
          await this.AssignOldCenterHeadDetails();

          await this.AssignOldCenterDocuments(centerDocumentsInfo, centerHeadPhoto, centerHeadSignature, supportableDocument);

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
    this.center_head_id = this.OldCenterDetails.center_head_id;
    this.center_head_name = this.OldCenterDetails.center_head_name;
    this.center_head_gender = this.OldCenterDetails.center_head_gender;
    this.center_head_contact_number = this.OldCenterDetails.center_head_contact_number;
    this.center_head_email_id = this.OldCenterDetails.center_head_email_id;
    this.center_head_state = this.OldCenterDetails.center_head_state;
    this.center_head_district = this.OldCenterDetails.center_head_district;
    this.center_head_post_office = this.OldCenterDetails.center_head_post_office;
    this.center_head_police_station = this.OldCenterDetails.center_head_police_station;
    this.center_head_village_city = this.OldCenterDetails.center_head_village_city;
    this.center_head_pin_code = this.OldCenterDetails.center_head_pin_code;

    this.genderDropdownOption.forEach(item => {
      if (this.OldCenterDetails.center_head_gender === item.text) {
        this.selectedGenderDropdown = item;
      }
    });
  }

  async AssignOldCenterDetails() {
    this.center_name = this.OldCenterDetails.center_name;
    this.center_user_id = this.OldCenterDetails.center_user_id;
    this.center_contact_number = this.OldCenterDetails.center_contact_number;
    this.center_email_id = this.OldCenterDetails.center_email_id;

    this.center_type = this.OldCenterDetails.center_type;
    this.center_state = this.OldCenterDetails.center_state;
    this.center_district = this.OldCenterDetails.center_district;
    this.center_post_office = this.OldCenterDetails.center_post_office;
    this.center_police_station = this.OldCenterDetails.center_police_station;
    this.center_village_city = this.OldCenterDetails.center_village_city;
    this.center_pin_code = this.OldCenterDetails.center_pin_code;
    this.center_data_status = this.OldCenterDetails.data_status;

    this.SelectedCourseCategories = this.AvilableCourseCategories.filter(item =>
      this.OldCenterDetails.center_categories.includes(item.id)
    );

    this.AvilableCenterTypes.forEach(item => {
      if (this.OldCenterDetails.center_type === item.id) {
        this.SelectedCenterType = item;
      }
    });
  }

  async AssignOldCenterDocuments(centerDocumentsInfo: any, centerHeadPhoto: Blob, centerHeadSignature: Blob, supportableDocument: Blob) {
    let documentInfo = centerDocumentsInfo.data[0];
    this.has_center_head_photo = documentInfo.center_head_photo === 1 ? true : false;
    this.has_center_head_signature = documentInfo.center_head_signature === 1 ? true : false;
    this.has_supportable_document = documentInfo.supportable_document === 1 ? true : false;

    let base64String = await convertBlobToBase64(centerHeadPhoto);
    this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_PHOTO] = `data:image/jpg;base64,${base64String}`;
    base64String = await convertBlobToBase64(centerHeadSignature);
    this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_SIGNATURE] = `data:image/jpg;base64,${base64String}`;
    base64String = await convertBlobToBase64(supportableDocument);
    this.OldCenterDocuments[FranchiseDocumentName.SUPPORTABLE_DOCUMENT] = `data:image/jpg;base64,${base64String}`;
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
      this.center_state = this.OldCenterDetails.center_state;
      this.center_district = this.OldCenterDetails.center_district;
      this.center_post_office = this.OldCenterDetails.center_post_office;
      this.center_police_station = this.OldCenterDetails.center_police_station;
      this.center_village_city = this.OldCenterDetails.center_village_city;
      this.center_pin_code = this.OldCenterDetails.center_pin_code;
    }
  }

  onStatusChange(isChecked: boolean) {
    this.center_data_status = isChecked ? ActiveInactiveStatus.ACTIVE : ActiveInactiveStatus.INACTIVE;
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
      this.center_head_photo_new = input.files[0];
    }
  }

  handleCenterHeadSignatureSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.center_head_signature_new = input.files[0];
    }
  }

  handleSupportableDocumentSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.supportable_document_new = input.files[0];
    }
  }

  download_and_view_existing_document(filename: string) {
    let download_file: string | null = "";
    let download_filename: string | null = "";

    if (filename === FranchiseDocumentName.CENTER_HEAD_PHOTO) {
      download_file = this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_PHOTO];
      download_filename = FranchiseDocumentName.CENTER_HEAD_PHOTO;
    } else if (filename === FranchiseDocumentName.CENTER_HEAD_SIGNATURE) {
      download_file = this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_SIGNATURE];
      download_filename = FranchiseDocumentName.CENTER_HEAD_SIGNATURE;
    } else if (filename === FranchiseDocumentName.SUPPORTABLE_DOCUMENT) {
      download_file = this.OldCenterDocuments[FranchiseDocumentName.SUPPORTABLE_DOCUMENT]
      download_filename = FranchiseDocumentName.SUPPORTABLE_DOCUMENT;
    }

    const link = document.createElement('a');
    link.href = download_file;

    let extension_name = "jpg";
    if (filename == FranchiseDocumentName.SUPPORTABLE_DOCUMENT) extension_name = "pdf";

    link.download = `${this.center_id}_${download_filename}.${extension_name}`;
    link.click();
  }

  reset_center_head_form() {
    this.AssignOldCenterHeadDetails();
    this.form1_visible = false;
    setTimeout(() => this.form1_visible = true);
  }

  reset_center_form() {
    this.CenterAddressStatus = false;
    this.AssignOldCenterDetails();
    this.form2_visible = false;
    setTimeout(() => this.form2_visible = true);
  }

  reset_center_head_photo_form(CenterHeadPhotoInput: HTMLInputElement) {
    this.center_head_photo_new = null;

    CenterHeadPhotoInput.value = '';
  }

  reset_center_head_signature_form(CenterHeadSignatureInput: HTMLInputElement) {
    this.center_head_signature_new = null;

    CenterHeadSignatureInput.value = '';
  }

  reset_supportable_document_form(SupportableDocumentInput: HTMLInputElement) {
    this.supportable_document_new = null;

    SupportableDocumentInput.value = '';
  }

  async submit_center_head_details() {
    try {
      const isValid = await this.validateCenterHeadForm();
      if (!isValid) return;
      this.activeMatProgressBar();

      const center_head_details = {
        center_head_id: this.center_head_id,
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

      await this.franchiseService.UpdateCenterHead(center_head_details).subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.openDialog("Franchise", response.message, ResponseTypeColor.ERROR, false);
          } else {
            this.openDialog("Franchise", response.message, ResponseTypeColor.SUCCESS, false);
          }
          this.hideMatProgressBar();
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Franchise", err.error.message, ResponseTypeColor.ERROR, false);
        }
      });
    } catch (err) {
      this.hideMatProgressBar();
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    }
  }

  async submit_center_details() {
    try {
      const isValid = await this.validateCenterDetailsForm();
      if (!isValid) return;
      this.activeMatProgressBar();

      const center_details = {
        center_id: this.center_id,
        center_name: this.center_name,
        center_user_id: this.center_user_id,
        center_contact_number: this.center_contact_number,
        center_email_id: this.center_email_id,
        center_category: this.center_category,
        center_type: this.center_type,
        center_state: this.center_state,
        center_district: this.center_district,
        center_post_office: this.center_post_office,
        center_police_station: this.center_police_station,
        center_village_city: this.center_village_city,
        center_pin_code: this.center_pin_code,
        center_data_status: this.center_data_status
      };

      await this.franchiseService.UpdateCenter(center_details).subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.openDialog("Franchise", response.message, ResponseTypeColor.ERROR, false);
          } else {
            this.openDialog("Franchise", response.message, ResponseTypeColor.SUCCESS, false);
          }
          this.hideMatProgressBar();
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Franchise", err.error.message, ResponseTypeColor.ERROR, false);
        }
      });
    } catch (err) {
      this.hideMatProgressBar();
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    }
  }

  async update_center_document(filename: string) {
    try {
      const isValid = await this.validateSupportableDocumentsForm(filename);
      if (!isValid) return;

      this.activeMatProgressBar();

      let formData = new FormData();
      formData.append("center_id", this.center_id);
      formData.append("filename", filename);

      if (filename === FranchiseDocumentName.CENTER_HEAD_PHOTO && this.center_head_photo_new) {
        formData.append("file", this.center_head_photo_new);
      } else if (filename === FranchiseDocumentName.CENTER_HEAD_SIGNATURE && this.center_head_signature_new) {
        formData.append("file", this.center_head_signature_new);
      } else if (filename === FranchiseDocumentName.SUPPORTABLE_DOCUMENT && this.supportable_document_new) {
        formData.append("file", this.supportable_document_new);
      }

      await this.franchiseService.UpdateFranchiseDocument(formData).subscribe({
        next: async (response) => {
          if (response.status === 200) {
            let centerDocumentsInfo = await firstValueFrom(this.franchiseService.GetCenterDocumeentsInfo(this.center_id));
            let documentInfo = centerDocumentsInfo.data[0];

            if (filename === FranchiseDocumentName.CENTER_HEAD_PHOTO) {
              let centerHeadPhoto = await firstValueFrom(this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.CENTER_HEAD_PHOTO));
              this.has_center_head_photo = documentInfo.center_head_photo === 1 ? true : false;
              let base64String = await convertBlobToBase64(centerHeadPhoto);
              this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_PHOTO] = `data:image/jpg;base64,${base64String}`;
              this.reset_center_head_photo_form(this.CenterHeadPhotoInput.nativeElement);
            }
            else if (filename === FranchiseDocumentName.CENTER_HEAD_SIGNATURE) {
              let centerHeadSignature = await firstValueFrom(this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.CENTER_HEAD_SIGNATURE));
              this.has_center_head_signature = documentInfo.center_head_signature === 1 ? true : false;
              let base64String = await convertBlobToBase64(centerHeadSignature);
              this.OldCenterDocuments[FranchiseDocumentName.CENTER_HEAD_SIGNATURE] = `data:image/jpg;base64,${base64String}`;
              this.reset_center_head_signature_form(this.CenterHeadSignatureInput.nativeElement);
            }
            else if (filename === FranchiseDocumentName.SUPPORTABLE_DOCUMENT) {
              let supportableDocument = await firstValueFrom(this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, FranchiseDocumentName.SUPPORTABLE_DOCUMENT));
              this.has_supportable_document = documentInfo.supportable_document === 1 ? true : false;
              let base64String = await convertBlobToBase64(supportableDocument);
              this.OldCenterDocuments[FranchiseDocumentName.SUPPORTABLE_DOCUMENT] = `data:image/jpg;base64,${base64String}`;
              this.reset_supportable_document_form(this.SupportableDocumentInput.nativeElement);
            }

            this.openDialog("Franchise", response.message, ResponseTypeColor.SUCCESS, false);
          } else {
            this.openDialog("Franchise", response.message, ResponseTypeColor.ERROR, false);
          }

          this.hideMatProgressBar();
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Franchise", "Internal Server Error", ResponseTypeColor.ERROR, false);
        }
      });
    } catch (error: any) {
      this.hideMatProgressBar();
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
    }
  }

  async validateCenterHeadForm() {
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

    return true;
  }

  async validateCenterDetailsForm() {
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

    return true;
  }

  async validateSupportableDocumentsForm(filename: string) {
    // Supportable Document Validation
    if (filename === FranchiseDocumentName.CENTER_HEAD_PHOTO && (!this.center_head_photo_new || this.center_head_photo_new === null)) {
      this.openDialog("Franchise", "Center Head Photo is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (filename === FranchiseDocumentName.CENTER_HEAD_SIGNATURE && (!this.center_head_signature_new || this.center_head_signature_new === null)) {
      this.openDialog("Franchise", "Center Head Signature is required", ResponseTypeColor.INFO, false);
      return false;
    }

    if (filename === FranchiseDocumentName.SUPPORTABLE_DOCUMENT && (!this.supportable_document_new || this.supportable_document_new === null)) {
      this.openDialog("Franchise", "Supportable Document is required", ResponseTypeColor.INFO, false);
      return false;
    }

    return true;
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

