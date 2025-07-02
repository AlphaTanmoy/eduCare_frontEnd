import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MasterDataService } from '../../../service/master-data/master-data.service';
import { COUNTER_TYPE, ResponseTypeColor } from '../../../constants/commonConstants';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

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
  styleUrls: ['./manage-counter.component.css']
})
export class ManageCounterComponent implements OnInit {
  counters: Counter[] = [];
  loading = false;
  updatingCounters: { [key: string]: boolean } = {};
  newValues: { [key: string]: number } = {};

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
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  ngOnInit(): void {
    this.loadCounters();
    this.bootstrapElements = loadBootstrap();
  }

  loadCounters(): void {
    this.loading = true;
    this.masterDataService.getAllCounters().subscribe({
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
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading counters:', error);
        this.openDialog('Error', error.message || 'Failed to load counters', ResponseTypeColor.ERROR);
        this.loading = false;
      }
    });
  }

  updateCounter(counter: Counter): void {
    const newValue = this.newValues[counter.key];
    if (isNaN(newValue) || newValue < 0) {
      this.openDialog('Invalid Input', 'Please enter a valid positive number', ResponseTypeColor.WARNING);
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

  ngOnDestroy(): void {
      if (this.bootstrapElements) {
        removeBootstrap(this.bootstrapElements);
      }
    }
}
