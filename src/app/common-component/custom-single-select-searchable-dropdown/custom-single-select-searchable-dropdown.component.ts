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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './custom-single-select-searchable-dropdown.component.html',
  styleUrls: ['./custom-single-select-searchable-dropdown.component.css'],
})
export class CustomSingleSelectSearchableDropdownComponent
  implements OnInit, OnDestroy {
  private bootstrapElements!: {
    css: HTMLLinkElement;
    js: HTMLScriptElement;
  };

  @Input() options: Dropdown[] = [];
  @Input() ariaPlaceholder: string = '';
  @Input() ariaLabel: string = '';
  @Output() optionSelected = new EventEmitter<Dropdown | null>();

  myControl = new FormControl<Dropdown | null>(null);
  filteredOptions: Observable<Dropdown[]> | undefined;

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const inputValue = typeof value === 'string' ? value : (value?.text ?? '');
        return this._filter(inputValue);
      })
    );
  }

  private _filter(value: string): Dropdown[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      (option.text || '').toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: Dropdown | null): string {
    return option ? option.text || '' : '';
  }

  onOptionSelected(event: any): void {
    const selected = event.option.value;
    console.log(selected)
    this.optionSelected.emit(selected); // Emits the full Dropdown object
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}