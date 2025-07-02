import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MasterDataService } from '../../../service/master-data/master-data.service';
import { COUNTER_TYPE, ResponseTypeColor } from '../../../constants/commonConstants';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { Subscription } from 'rxjs';

interface Counter {
  _id: string;
  key: COUNTER_TYPE;
  value: number;
  example: string;
  displayName: string;
}

@Component({
  selector: 'app-manage-counter',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule
  ],
  templateUrl: './manage-counter.component.html',
  styleUrls: ['./manage-counter.component.css'],
  host: { 'class': 'd-block' }
})
export class ManageCounterComponent implements OnInit, OnDestroy {
  counters: Counter[] = [];
  filteredCounters: Counter[] = [];
  loading = false;
  error: string | null = null;
  searchQuery: string = '';
  updatingCounters: { [key: string]: boolean } = {};
  newValues: { [key: string]: number } = {};
  private subscriptions = new Subscription();
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  // Map counter keys to display names
  counterDisplayNames: { [key in COUNTER_TYPE]: string } = {
    [COUNTER_TYPE.REGISTRATION_NUMBER_SERIAL]: 'Registration Number',
    [COUNTER_TYPE.CERTIFICATION_NUMBER_SERIAL]: 'Certificate Number',
    [COUNTER_TYPE.FRANCHISE_NUMBER_SERIAL]: 'Franchise Number',
    [COUNTER_TYPE.NOTIFICATION_NUMBER_SERIAL]: 'Notification Number',
    [COUNTER_TYPE.YT_LINK_SERIAL]: 'YouTube Link',
    [COUNTER_TYPE.CONTACT_TICKET_SERIAL]: 'Contact Ticket'
  };

  constructor(
    private masterDataService: MasterDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCounters();
    this.bootstrapElements = loadBootstrap();
    this.removeBackdropOverlays();
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
    this.subscriptions.unsubscribe();
  }

  private removeBackdropOverlays(): void {
    setTimeout(() => {
      // Remove any Material dialog backdrops
      const materialBackdrops = document.querySelectorAll('.cdk-overlay-backdrop, .cdk-overlay-dark-backdrop, .cdk-overlay-container');
      materialBackdrops.forEach(backdrop => {
        backdrop.remove();
      });

      // Remove any Bootstrap modals
      const bootstrapModals = document.querySelectorAll('.modal-backdrop');
      bootstrapModals.forEach(modal => {
        modal.remove();
      });

      // Remove any overlay containers
      const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
      overlayContainers.forEach(container => {
        container.remove();
      });

      // Remove any body classes that might be causing the darkening
      document.body.classList.remove('cdk-global-scrollblock', 'modal-open');
    }, 100);
  }

  loadCounters(): void {
    this.loading = true;
    this.error = null;
    
    const sub = this.masterDataService.getAllCounters().subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.counters = response.data.map((counter: any) => {
            const counterKey = counter.key as COUNTER_TYPE;
            this.newValues[counterKey] = counter.value;
            return {
              ...counter,
              displayName: this.counterDisplayNames[counterKey] || counter.key
            };
          });
          this.filteredCounters = [...this.counters];
        } else {
          this.error = 'Invalid response format from server';
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading counters:', error);
        this.error = error.message || 'Failed to load counters. Please try again later.';
        this.loading = false;
      }
    });

    this.subscriptions.add(sub);
  }

  filterCounters(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCounters = [...this.counters];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCounters = this.counters.filter(counter => 
      counter.displayName.toLowerCase().includes(query) || 
      counter.key.toLowerCase().includes(query) ||
      counter.example.toLowerCase().includes(query) ||
      counter.value.toString().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredCounters = [...this.counters];
  }

  onCounterValueChange(counter: Counter, newValue: number): void {
    // Ensure the value is a valid number
    const numericValue = Number(newValue);
    if (!isNaN(numericValue)) {
      this.newValues[counter.key] = numericValue;
    } else {
      this.newValues[counter.key] = counter.value;
    }
  }

  isValueDecreased(counter: Counter): boolean {
    const newValue = this.newValues[counter.key];
    return newValue !== undefined && newValue < counter.value;
  }

  updateCounter(counter: Counter): void {
    const newValue = this.newValues[counter.key];
    
    if (isNaN(newValue) || newValue < 0) {
      this.openDialog('Invalid Input', 'Please enter a valid positive number', ResponseTypeColor.WARNING);
      return;
    }

    if (this.isValueDecreased(counter)) {
      this.openDialog('Invalid Input', 'Cannot set a value less than the current counter value', ResponseTypeColor.WARNING);
      return;
    }

    this.updatingCounters[counter.key] = true;
    
    this.masterDataService.updateCounter(counter.key, newValue).subscribe({
      next: () => {
        counter.value = newValue;
        this.openDialog('Success', 'Counter updated successfully', ResponseTypeColor.SUCCESS);
        this.updatingCounters[counter.key] = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating counter:', error);
        this.openDialog('Error', error.message || 'Failed to update counter', ResponseTypeColor.ERROR);
        this.updatingCounters[counter.key] = false;
      }
    });
  }

  isUpdating(key: string): boolean {
    return this.updatingCounters[key] || false;
  }

  private openDialog(title: string, message: string, type: ResponseTypeColor, reload: boolean = false): void {
    // Map the ResponseTypeColor to the values expected by CustomAlertComponent
    const alertTypeMap = {
      [ResponseTypeColor.SUCCESS]: 1, // SUCCESS
      [ResponseTypeColor.WARNING]: 2, // WARNING
      [ResponseTypeColor.INFO]: 3,    // INFO
      [ResponseTypeColor.ERROR]: 4    // ERROR
    };

    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: title,
        text: message,
        type: alertTypeMap[type] || 1 // Default to SUCCESS if not found
      },
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      if (reload) {
        this.loadCounters();
      }
      dialogSub.unsubscribe();
    });
  }


}
