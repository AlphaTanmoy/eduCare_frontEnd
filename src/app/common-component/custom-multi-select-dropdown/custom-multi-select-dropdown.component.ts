import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-custom-multi-select-dropdown',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatCheckboxModule, MatDividerModule],
  templateUrl: './custom-multi-select-dropdown.component.html',
  styleUrl: './custom-multi-select-dropdown.component.css'
})
export class CustomMultiSelectDropdownComponent {
  selectedItems = new FormControl('');
  itemList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  @Input() dropdownLabel: string = "";
  @Output() selectedItemsChanged = new EventEmitter<string[]>();

  constructor() {
    this.selectedItems.valueChanges.subscribe((value: any) => {
      this.selectedItemsChanged.emit(value);
    });
  }
}
