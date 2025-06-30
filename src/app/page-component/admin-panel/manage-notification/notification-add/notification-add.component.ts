import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-notification-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-add.component.html',
  styleUrls: ['./notification-add.component.css']
})
export class NotificationAddComponent implements OnInit {
  notificationForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.notificationForm = this.fb.group({
      heading: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean = false): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }

  onSubmit(): void {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { heading, message } = this.notificationForm.value;

    this.masterDataService.createNotification(heading, message).subscribe({
      next: (response: any) => {
        if (response?.responseType === 'SUCCESS') {
          this.openDialog('Success', 'Notification created successfully', ResponseTypeColor.SUCCESS, false);
          this.router.navigate(['/control-panel/manage-notification']);
        } else {
          const errorMessage = response?.message || 'Failed to create notification. Please try again.';
          this.error = errorMessage;
          this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error creating notification:', error);
        const errorMessage = error.error?.message || 'Failed to create notification. Please try again.';
        this.error = errorMessage;
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.notificationForm.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.router.navigate(['/control-panel/add-notification']);
      }
    } else {
      this.router.navigate(['/control-panel/add-notification']);
    }
  }
}
