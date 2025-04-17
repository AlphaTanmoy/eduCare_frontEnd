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
import { CustomMultiSelectDropdownComponent } from '../../../common-component/custom-multi-select-dropdown/custom-multi-select-dropdown.component';

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
    private cdr: ChangeDetectorRef,
    private indexedDbService: IndexedDbService
  ) { }

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  dropdownOption = Gender;
  dropdownPlaceholder: string = "Search/Select Gender";
  dropdownpLabel: string = "Gender selection";

  selectedStepIndex: number = 0;
  isLinear = false;

  CenterAddressStatus: boolean = false;
  AvilableCourses: any[] = [];

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();
    this.commonService.getAllAvailableCourses().subscribe({
      next: async (response) => {
        this.AvilableCourses = response.data;
        this.hideMatProgressBar();
      },
      error: (err) => {
        this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
        this.hideMatProgressBar();
      }
    });
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
    console.log(event, " is selected");
  }

  onCheckboxChange(event: Event): void {
    this.CenterAddressStatus = (event.target as HTMLInputElement).checked;
    console.log('Checkbox is checked:', this.CenterAddressStatus);
  }

  handleSelectedCourses(selectedItems: string[]) {
    console.log('Selected items:', selectedItems);
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
