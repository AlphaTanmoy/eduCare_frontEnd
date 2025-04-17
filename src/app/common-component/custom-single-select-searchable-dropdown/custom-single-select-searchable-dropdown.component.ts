import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-custom-single-select-searchable-dropdown',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './custom-single-select-searchable-dropdown.component.html',
  styleUrl: './custom-single-select-searchable-dropdown.component.css',
})

export class CustomSingleSelectSearchableDropdownComponent implements OnInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;

  @Input() options: string[] = [];
  @Input() ariaPlaceholder: string | undefined;
  @Input() ariaLabel: string | undefined;
  @Output() optionSelected = new EventEmitter<string>();

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    this.optionSelected.emit(event.option.value);
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
