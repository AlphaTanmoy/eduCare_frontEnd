import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-human-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './human-verification.component.html',
  styleUrls: ['./human-verification.component.css']
})
export class HumanVerificationComponent implements OnInit {
  @Output() verificationComplete = new EventEmitter<void>();
  
  isLoading = true;
  showCheckbox = false;
  isVerified = false;
  isComplete = false;
  
  ngOnInit() {
    // Show loading for 3 seconds
    setTimeout(() => {
      this.isLoading = false;
      this.showCheckbox = true;
    }, 3000);
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.isVerified = true;
      
      // Show completion message for 1.5 seconds before closing
      setTimeout(() => {
        this.isComplete = true;
        this.verificationComplete.emit();
      }, 1500);
    }
  }
}
