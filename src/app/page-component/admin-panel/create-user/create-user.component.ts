import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';

@Component({
  selector: 'app-create-user',
  imports: [CustomSingleSelectSearchableDropdownComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})

export class CreateUserComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  dropdownOption: string[] = ['One', 'Two', 'Three', 'Four'];
  dropdownplaceholder: string = "Search/Select an item";
  dropdownpLabel: string = "Number selection";

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.openDialog();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  handleOptionSelection(event: any): void {
    console.log(event, " is selected");
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: 'Custom Dialog Title',
        text: 'This is a dynamically passed dialog message.'
      }
    });
  }
}
