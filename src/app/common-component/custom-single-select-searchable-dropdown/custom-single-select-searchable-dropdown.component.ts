import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { Dropdown } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-single-select-searchable-dropdown',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './custom-single-select-searchable-dropdown.component.html',
  styleUrls: ['./custom-single-select-searchable-dropdown.component.css'],
})
export class CustomSingleSelectSearchableDropdownComponent {
  myControl = new FormControl('');
  optionsList: Dropdown[] = [];
  filteredOptions: Observable<Dropdown[]> | undefined;

  @Input() ariaPlaceholder: string = '';
  @Input() ariaLabel: string = '';
  @Output() optionSelected = new EventEmitter<Dropdown | null>();

  @Input()
  set options(value: Dropdown[]) {
    if (value?.length) {
      this.optionsList = value;
      // Re-initialize the filtered options when new data arrives
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(this.myControl.value),
        map(inputValue => this._filter(inputValue || ''))
      );
    }
  }

  constructor() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string | Dropdown): Dropdown[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() :
      typeof value === 'object' ? value.text?.toLowerCase() || '' : '';

    return this.optionsList.filter((option: Dropdown) =>
      option.text?.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: Dropdown): string {
    return option && option.text ? option.text : '';
  }

  onSelectionChange(event: any): void {
    const selectedOption = event.option?.value;
    this.optionSelected.emit(selectedOption);
  }
}