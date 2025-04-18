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
  standalone: true,
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
export class CustomSingleSelectSearchableDropdownComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  @Input() options: Dropdown[] = [];
  @Input() ariaPlaceholder: string = '';
  @Input() ariaLabel: string = '';
  @Output() optionSelected = new EventEmitter<Dropdown | null>();

  myControl = new FormControl('');
  optionsList: Dropdown[] = [];
  filteredOptions: Observable<Dropdown[]> | undefined;

  ngOnInit() {
    this.optionsList = this.options;
    this.bootstrapElements = loadBootstrap();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string | Dropdown): Dropdown[] {
    // Handle case where value might be the selected Dropdown object
    const filterValue = typeof value === 'string' ? value.toLowerCase() :
      typeof value === 'object' ? value.text?.toLowerCase() || '' : '';

    return this.optionsList.filter((option: Dropdown) =>
      option.text?.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: Dropdown): string {
    return option && option.text ? option.text : '';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}