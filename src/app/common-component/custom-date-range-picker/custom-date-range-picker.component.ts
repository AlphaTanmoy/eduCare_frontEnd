import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-custom-date-range-picker',
  imports: [MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-date-range-picker.component.html',
  styleUrl: './custom-date-range-picker.component.css'
})
export class CustomDateRangePickerComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  @Input() placeholder: string = 'Select a date range';
  @Output() dateChanged = new EventEmitter<[Date, Date]>();

  selectedRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  selectedDate: Date | null = null;
  defaultPlaceholder: string = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.defaultPlaceholder = this.placeholder;
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  onStartChange(event: any) {
    this.selectedRange.start = event.value;

    if (this.selectedRange.start && this.selectedRange.end) {
      this.emitSortedDates();
    }
  }

  onEndChange(event: any) {
    this.selectedRange.end = event.value;

    if (this.selectedRange.start && this.selectedRange.end) {
      this.emitSortedDates();
    }
  }

  private emitSortedDates() {
    const { start, end } = this.selectedRange;

    if (!start || !end) return;

    const sorted = [start, end].sort((a, b) => a.getTime() - b.getTime()) as [Date, Date];

    // Go +1 date
    sorted[1].setDate(sorted[1].getDate() + 1);
    // Subtract 1 millisecond from the end date
    const endMinusOneMs = new Date(sorted[1].getTime() - 1);

    this.dateChanged.emit([sorted[0], endMinusOneMs]);
  }


}
