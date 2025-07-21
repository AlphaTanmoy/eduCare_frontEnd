import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EpdfService } from '../../../service/epdf/epdf.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

interface EPDF {
  _id: string;
  code: string;
  name: string;
  link: string;
  course_codes: string[];
  data_status: string;
}

@Component({
  selector: 'app-epdf',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './epdf.component.html',
  styleUrls: ['./epdf.component.css']
})
export class EpdfComponent {
  searchForm: FormGroup;
  epdfs: EPDF[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private epdfService: EpdfService
  ) {
    this.searchForm = this.fb.group({
      year: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{2}$'),
        Validators.min(0),
        Validators.max(99)
      ]],
      registrationNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$')
      ]]
    });

    // Prevent non-numeric input for both fields
    this.preventNonNumericInput('year');
    this.preventNonNumericInput('registrationNumber');
  }

  private preventNonNumericInput(controlName: string): void {
    const control = this.searchForm.get(controlName);
    if (control) {
      control.valueChanges.subscribe(value => {
        if (value && !/^\d*$/.test(value)) {
          control.setValue(value.replace(/[^0-9]/g, ''), { emitEvent: false });
        }
        // Limit length
        if (value && value.length > (controlName === 'year' ? 2 : 5)) {
          control.setValue(value.slice(0, controlName === 'year' ? 2 : 5), { emitEvent: false });
        }
      });
    }
  }

  get registrationNumber() {
    return this.searchForm.get('registrationNumber');
  }

  get year() {
    return this.searchForm.get('year');
  }

  get fullRegistrationNumber(): string {
    const year = this.year?.value?.toString().padStart(2, '0') || '';
    const number = this.registrationNumber?.value || '';
    return `ECI${year}-${number}`;
  }

  onSearch(): void {
    console.log('Form submitted', this.searchForm.value);

    if (this.searchForm.invalid) {
      console.log('Form is invalid');
      this.searchForm.markAllAsTouched();
      return;
    }

    const registrationNumber = this.fullRegistrationNumber;
    console.log('Fetching EPDFs for:', registrationNumber);

    this.isLoading = true;
    this.error = null;

    this.epdfService.getEPDFForStudent(registrationNumber).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        // Check both possible response formats
        if (response?.data?.[0]?.epdfs) {
          this.epdfs = response.data[0].epdfs;
        } else if (response?.data?.epdfs) {
          this.epdfs = response.data.epdfs;
        } else if (response?.epdfs) {
          this.epdfs = response.epdfs;
        } else {
          this.epdfs = [];
          this.error = 'No EPDFs found for this student';
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching EPDFs:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          url: err.url
        });
        this.error = err.error?.message || `Error fetching EPDFs (${err.status}): ${err.statusText}`;
        this.isLoading = false;
      }
    });
  }

  openPdf(link: string): void {
    if (!link.startsWith('http')) {
      link = 'https://' + link;
    }
    window.open(link, '_blank');
  }
}
