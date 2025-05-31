import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeDate();
    this.defaultPlaceholder = this.placeholder;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultDate']) {
      this.initializeDate();
      this.cdr.markForCheck(); // Trigger change detection
    }
    if (changes['placeholder']) {
      this.defaultPlaceholder = this.placeholder;
      this.cdr.markForCheck();
    }
  }

  private initializeDate() {
    this.selectedDate = this.defaultDate ? new Date(this.defaultDate) : null;
    console.log('Selected date initialized:', this.selectedDate);
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.dateChanged.emit(event.value as Date);
  }
}