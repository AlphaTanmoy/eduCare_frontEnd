import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, FeedbackReportData } from '../../../service/contact/contact.service';
import { ResponseTypeColor } from '../../../constants/commonConstants';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private contactService = inject(ContactService);
  private bootstrapElements: any;

  FeedbackReport: FeedbackReportData = {
    emailId: '',
    message: ''
  };
  
  isLoading = false;

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  onSubmit(): void {
    if (!this.FeedbackReport.emailId || !this.FeedbackReport.message) {
      this.openDialog('Error', 'Please fill in all required fields.', ResponseTypeColor.ERROR, false);
      return;
    }

    if (!this.isValidEmail(this.FeedbackReport.emailId)) {
      this.openDialog('Error', 'Please enter a valid email address.', ResponseTypeColor.ERROR, false);
      return;
    }

    this.isLoading = true;
    
    this.contactService.submitFeedbackReport(this.FeedbackReport).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.openDialog(
          'Success', 
          'Thank you for reporting this issue. We will look into it shortly.', 
          ResponseTypeColor.SUCCESS, 
          true
        );
        this.FeedbackReport = { emailId: '', message: '' }; // Reset form
      },
      error: (error) => {
        console.error('Error submitting Feedback report:', error);
        this.isLoading = false;
        this.openDialog(
          'Error', 
          'Failed to submit Feedback report. Please try again later.', 
          ResponseTypeColor.ERROR, 
          false
        );
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private openDialog(title: string, text: string, type: number, reload: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title, text, type }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (reload) {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }
}
