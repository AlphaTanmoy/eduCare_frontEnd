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
  selectedItems = new FormControl<string[]>([]);
  itemList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  readonly SELECT_ALL_VALUE = '__select_all__';

  @Input() dropdownLabel: string = "";
  @Output() selectedItemsChanged = new EventEmitter<string[]>();

  constructor() {
    this.selectedItems.valueChanges.subscribe((value: any) => {
      const cleaned = value?.filter((v: string) => v !== this.SELECT_ALL_VALUE) || [];
      this.selectedItems.setValue(cleaned, { emitEvent: false });
      this.selectedItemsChanged.emit(cleaned);
    });
  }

  isAllSelected(): boolean {
    return this.itemList.length > 0 &&
      this.selectedItems.value?.length === this.itemList.length;
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedItems.setValue([]);
    } else {
      this.selectedItems.setValue([...this.itemList]);
    }
    this.selectedItemsChanged.emit(this.selectedItems.value || []);
  }
}