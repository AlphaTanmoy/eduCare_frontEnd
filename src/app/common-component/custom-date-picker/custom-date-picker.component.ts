import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, Inject, LOCALE_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Using UK format (DD/MM/YYYY)
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule],
  templateUrl: './custom-date-picker.component.html',
  styleUrl: './custom-date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDatePickerComponent implements OnInit, OnChanges {
  @Input() defaultDate: Date | null = null;
  @Input() placeholder: string = 'Choose a date';
  @Output() dateChanged = new EventEmitter<Date>();

  selectedDate: Date | null = null;
  defaultPlaceholder: string = '';
  today = new Date();
  dateFilter = (d: Date | null): boolean => {
    // Prevent selecting future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d <= today : true;
  };

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.initializeDate();
    this.defaultPlaceholder = this.placeholder;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultDate']) {
      this.initializeDate();
      this.cdr.markForCheck();
    }
    if (changes['placeholder']) {
      this.defaultPlaceholder = this.placeholder;
      this.cdr.markForCheck();
    }
  }

  private initializeDate() {
    this.selectedDate = this.defaultDate ? new Date(this.defaultDate) : null;
  }

  onDateChange(event: any) {
    if (event.value) {
      try {
        // Format the date to ensure consistency
        const date = new Date(event.value);
        if (!isNaN(date.getTime())) {
          this.selectedDate = date;
          this.dateChanged.emit(date);
        } else {
          console.error('Invalid date selected');
        }
      } catch (error) {
        console.error('Error processing date:', error);
      }
    } else {
      this.selectedDate = null;
      this.dateChanged.emit(null as any);
    }
    this.cdr.markForCheck();
  }
}