import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [CommonModule, FormsModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  IsChecked: boolean = false;

  onCheckboxChange(event: any){

  }
}
