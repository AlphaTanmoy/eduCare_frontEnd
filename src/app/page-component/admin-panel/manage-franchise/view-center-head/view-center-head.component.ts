import { Component, OnInit, OnDestroy, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../../../constants/commonConstants';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-view-center-head',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './view-center-head.component.html',
  styleUrl: './view-center-head.component.css'
})
export class ViewCenterHeadComponent implements OnInit, OnDestroy {
  center_head_id: string = '';
  center_id: string = '';

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  center_head_name: string = '';
  center_head_gender: string = '';
  center_head_contact_number: string = '';
  center_head_email_id: string = '';
  center_head_address: string = '';
  center_head_data_status: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { center_head_id: string; center_id: string },
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.center_id = this.data.center_id;
    this.center_head_id = this.data.center_head_id;

    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.franchiseService.GetCenterHeadDetails(this.center_head_id));

      let data = res.data[0];
      this.center_head_name = data.center_head_name;
      this.center_head_gender = data.center_head_gender;
      this.center_head_contact_number = data.center_head_contact_number;
      this.center_head_email_id = data.center_head_email_id;
      this.center_head_address = data.center_head_address;
      this.center_head_data_status = data.data_status;
    } catch (error) {
      this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR);
    } finally {
      this.hideMatProgressBar();
    }
  }

  GetDataStatusLabel(value: string): string {
    return ActiveInactiveStatusDescriptions[value as ActiveInactiveStatus] || 'Unknown';
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number): void {
    this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });
  }
}
