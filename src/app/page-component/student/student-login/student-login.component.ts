import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentService, StudentLoginResponse } from '../../../service/student/student.service';
import { AuthService } from '../../../service/auth/Auth.Service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnDestroy {
  regPrefix: string = 'ECI';
  regYear: string = '';
  regNumber: string = '';
  day: string = '';
  month: string = '';
  year: string = '';
  isLoading: boolean = false;
  private bootstrapElements: any;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }

  onInput(event: any, nextField?: string): void {
    const input = event.target;
    const value = input.value;
    
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) {
      input.value = value.replace(/\D/g, '');
      return;
    }

    // Auto-tab to next field if max length reached
    if (value.length >= input.maxLength && nextField) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  login(event: Event): void {
    event.preventDefault();
    
    // Validate all fields are filled
    if (!this.regYear || !this.regNumber || !this.day || !this.month || !this.year) {
      this.showError('Please fill in all fields');
      return;
    }

    // Validate registration number parts are numbers
    if (!this.isNumeric(this.regYear) || !this.isNumeric(this.regNumber)) {
      this.showError('Registration number must contain only numbers');
      return;
    }

    // Validate date parts are numbers
    if (!this.isNumeric(this.day) || !this.isNumeric(this.month) || !this.isNumeric(this.year)) {
      this.showError('Date of birth must contain only numbers');
      return;
    }

    const day = parseInt(this.day, 10);
    const month = parseInt(this.month, 10);
    const year = parseInt(this.year, 10);

    // Validate date is valid
    if (!this.isValidDate(day, month, year)) {
      this.showError('Please enter a valid date');
      return;
    }

    // Format date as YYYY-MM-DD for the API
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const registrationNumber = `${this.regPrefix}${this.regYear}-${this.regNumber.padStart(5, '0')}`;
    
    this.isLoading = true;
    
    this.studentService.studentLogin(registrationNumber, formattedDate).subscribe({
      next: (response: StudentLoginResponse) => {
        this.isLoading = false;
        if (response.status === 200 && response.responseType === 'SUCCESS') {
          // Save token and redirect to student dashboard
          this.authService.saveToken(response.token);
          this.showSuccess('Login successful! Redirecting to dashboard...');
          
          // Add a small delay before redirecting to show the success message
          setTimeout(() => {
            this.router.navigate(['/student/dashboard']);
          }, 1500);
        } else {
          this.showError(response.message || 'Invalid credentials');
        }
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred during login';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Invalid registration number or date of birth';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        this.showError(errorMessage);
      }
    });
  }

  private showError(message: string): void {
    this.openDialog('Error', message, 3, null); // Type 3 is for error
  }

  private showSuccess(message: string): void {
    this.openDialog('Success', message, 1, null); // Type 1 is for success
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: any): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { 
      data: { 
        title: dialogTitle, 
        text: dialogText, 
        type: dialogType 
      } 
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (navigateRoute) {
        if (navigateRoute === 'logout') {
          // Handle logout if needed
        } else {
          this.router.navigate([navigateRoute]);
        }
      }
    });
  }

  // Helper method to check if a string is a valid number
  private isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  // Helper method to validate date components
  private isValidDate(day: number, month: number, year: number): boolean {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Check for months with 30 days
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    // Check for February
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      return isLeapYear ? day <= 29 : day <= 28;
    }
    
    return true;
  }
}
