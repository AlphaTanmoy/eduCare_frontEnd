import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';

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
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  handleOptionSelection(event: any): void {
    console.log(event, " is selected");
  }
}
