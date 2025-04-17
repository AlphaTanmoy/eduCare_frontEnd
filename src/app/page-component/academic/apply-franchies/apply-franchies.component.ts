import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { Gender } from '../../../constants/commonConstants';

@Component({
  selector: 'app-apply-franchies',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CustomSingleSelectSearchableDropdownComponent
  ],
  templateUrl: './apply-franchies.component.html',
  styleUrl: './apply-franchies.component.css'
})

export class ApplyFranchiesComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  private _formBuilder = inject(FormBuilder);

  dropdownOption = Gender;
  dropdownPlaceholder: string = "Search/Select Gender";
  dropdownpLabel: string = "Gender selection";

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
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
  isLinear = false;



  handleOptionSelection(event: any): void {
    console.log(event, " is selected");
  }
}
