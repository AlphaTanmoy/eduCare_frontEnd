import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  styleUrl: './custom-single-select-searchable-dropdown.component.css',
})
export class CustomSingleSelectSearchableDropdownComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  myControl = new FormControl<any | null>(null); // store full object

  filteredOptions!: Observable<Dropdown[]>;

  @Input() options: Dropdown[] = [];
  @Input() ariaPlaceholder: any;
  @Input() ariaLabel: any;
  @Output() optionSelected = new EventEmitter<Dropdown>();

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.text || '')),
      map(text => this._filter(text))
    );
  }

  private _filter(value: string): Dropdown[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: Dropdown) => option?.text?.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selected: Dropdown = event.option.value;
    this.optionSelected.emit(selected);
  }

  displayFn(option: Dropdown): string {
    return option && option.text ? option.text : '';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}