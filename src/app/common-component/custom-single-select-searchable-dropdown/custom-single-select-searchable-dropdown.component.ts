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
export class CustomSingleSelectSearchableDropdownComponent {
  myControl = new FormControl<string | Dropdown>(''); // Allow both string and Dropdown types
  filteredOptions: Observable<Dropdown[]> = new Observable<Dropdown[]>();
  private _options: Dropdown[] = [];

  @Input() ariaLabel: string = '';
  @Input() selectedOptions: Dropdown | null = null;
  @Input() options: Dropdown[] = [];
  @Output() selectionChange = new EventEmitter<Dropdown | null>();

  compareDropdowns(a: Dropdown, b: Dropdown){
    return a && b && a.id === b.id;
  };

  onSelectionChange(event: any): void {
    const selectedOption = event.value;
    this.selectionChange.emit(selectedOption);
  }
}