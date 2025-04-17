import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { Dropdown } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-multi-select-dropdown',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatCheckboxModule, MatDividerModule],
  templateUrl: './custom-multi-select-dropdown.component.html',
  styleUrl: './custom-multi-select-dropdown.component.css'
})

export class CustomMultiSelectDropdownComponent {
  selectedItems = new FormControl<Dropdown[]>([]);
  itemList: Dropdown[] = [];
  readonly SELECT_ALL_VALUE = '__select_all__';

  @Input() dropdownLabel: string | undefined = "Select";
  // @Input() dropdownList: Dropdown[] = [];
  @Output() selectedItemsChanged = new EventEmitter<Dropdown[]>();

  @Input()
  set dropdownList(value: Dropdown[]) {
    this.itemList = value;
    if (value?.length) {
      this.itemList = value;
      console.log('dropdownList updated via setter:', value);
    }
  }
  get dropdownList(): Dropdown[] {
    return this.itemList;
  }

  // ngOnInit(): void {
  //   console.log("this.dropdownList", this.dropdownList)
  //   // Optional: fallback or default list
  //   if (this.dropdownList?.length) {
  //     this.itemList = this.dropdownList;
  //   }
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log("this.dropdownList1", this.dropdownList)
  //   if (changes['dropdownList'] && this.dropdownList?.length) {
  //     this.itemList = this.dropdownList;
  //     console.log("this.dropdownList2", this.dropdownList)
  //   }
  // }

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