import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dropdown } from '../../constants/commonConstants';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-custom-single-select-searchable-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  templateUrl: './custom-single-select-searchable-dropdown.component.html',
  styleUrls: ['./custom-single-select-searchable-dropdown.component.css'],
})
export class CustomSingleSelectSearchableDropdownComponent implements OnInit, OnChanges {
  myControl = new FormControl<string | Dropdown>(''); // Allow both string and Dropdown types
  filteredOptions: Observable<Dropdown[]> = new Observable<Dropdown[]>();
  private _options: Dropdown[] = [];

  @Input() ariaLabel: string = '';
  @Input() initialValue: Dropdown | null = null;
  @Output() selectionChange = new EventEmitter<Dropdown | null>();

  @Input()
  set options(value: Dropdown[]) {
    this._options = value || [];
    this.initializeFilter();
  }
  get options(): Dropdown[] {
    return this._options;
  }

  ngOnInit(): void {
    this.initializeFilter();

    if (this.initialValue) {
      this.myControl.setValue(this.initialValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      this.myControl.setValue(changes['initialValue'].currentValue);
    }
  }

  private initializeFilter(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(this.myControl.value),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string | Dropdown | null): Dropdown[] {
    if (!this.options || this.options.length === 0) {
      return [];
    }

    const filterValue = typeof value === 'string'
      ? value.toLowerCase()
      : value && typeof value === 'object'
        ? value.text?.toLowerCase() || ''
        : '';

    return this.options.filter(option =>
      option.text?.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: Dropdown): string {
    return option && option.text ? option.text : '';
  }

  onSelectionChange(event: any): void {
    const selectedOption = event.value;
    this.selectionChange.emit(selectedOption);
  }
}