import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { Gender, ResponseTypeColor } from '../../../constants/commonConstants';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../service/common/common.service';
import { IndexedDbService } from '../../../service/indexed-db/indexed-db.service';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Dropdown } from '../../../constants/commonConstants';
import { CustomMultiSelectDropdownComponent } from '../../../common-component/custom-multi-select-dropdown/custom-multi-select-dropdown.component';
import { FranchiseService } from '../../../service/franchise/franchise.service';

@Component({
  selector: 'app-apply-franchies',
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
    MatProgressBarModule
  ],
  templateUrl: './apply-franchies.component.html',
  styleUrl: './apply-franchies.component.css'
})

export class ApplyFranchiesComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);

  constructor(
    private commonService: CommonService,
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef,
    private indexedDbService: IndexedDbService
  ) { }

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  genderDropdownOption = Gender;

  selectedStepIndex: number = 0;
  isLinear = false;

  CenterAddressStatus: boolean = false;
  AvilableCourses: Dropdown[] = [];
  AvilableCenterTypes: Dropdown[] = [];

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
  //#endregion 

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();

    try {
      this.commonService.getAllAvailableCourses().subscribe({
        next: async (response) => {
          response.data.forEach((element: any) => {
            this.AvilableCourses.push(new Dropdown(element.course_code, element.course_name));
          });
        },
        error: (err) => {
          this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      });

      this.commonService.getAllAvailableCenterTypes().subscribe({
        next: async (response) => {
          response.data.forEach((element: any) => {
            this.AvilableCenterTypes.push(new Dropdown(element.center_type_code, element.center_type_name));
          });

          this.hideMatProgressBar();
        },
        error: (err) => {
          this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
          this.hideMatProgressBar();
        }
      });
    } catch (error) {
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
      this.hideMatProgressBar();
    }
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
    this.center_category = selectedItems.map((item: Dropdown) => item.text ?? "");
  }

  handleCenterTypeSelection(selectedItem: any) {
    this.center_type = selectedItem.text ?? "";
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
  }

  reset_document_form() {

  }

  async submit() {
    this.activeMatProgressBar();

    const center_head = await this.saveCenterHeadDetails();
    const center = await this.saveCenterDetails(null);

    console.log("center_head", center_head)
    console.log("center", center)

    this.hideMatProgressBar();
  }

  async saveCenterHeadDetails() {
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
    }

    this.franchiseService.AddCenterHead(center_head_details).subscribe({
      next: async (response) => {
        return response.center_head_id;
      },
      error: (err) => {
        this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
        return null;
      }
    });

    return null;
  }

  async saveCenterDetails(center_head: any) {
    const center_details = {
      center_head_id: center_head.center_head_id,
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
    }

    this.franchiseService.AddCenter(center_details).subscribe({
      next: async (response) => {
        return response.center_head_id;
      },
      error: (err) => {
        this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
        return null;
      }
    });

    return null;
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
