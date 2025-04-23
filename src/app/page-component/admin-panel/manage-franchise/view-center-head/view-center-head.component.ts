import { Component, OnInit, OnDestroy, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ActiveInactiveStatus, ActiveInactiveStatusDescriptions, FranchiseDocumentName, ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../../../constants/commonConstants';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { faEye, faEyeSlash, faFileDownload, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { convertBlobToBase64 } from '../../../../utility/common-util';

@Component({
  selector: 'app-view-center-head',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './view-center-head.component.html',
  styleUrl: './view-center-head.component.css'
})
export class ViewCenterHeadComponent implements OnInit, OnDestroy {
  center_head_id: string = '';
  center_id: string = '';

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faFileDownload = faFileDownload;
  faClose = faClose;

  ActiveInactiveStatusDescriptions = ActiveInactiveStatusDescriptions;
  ActiveInactiveStatus = ActiveInactiveStatus;

  center_head_name: string = '';
  center_head_gender: string = '';
  center_head_contact_number: string = '';
  center_head_email_id: string = '';
  center_head_address: string = '';
  center_head_data_status: string = '';

  center_head_documnt_photo: string = '';
  center_head_documnt_name: string = '';
  center_head_documnt_display_header: string = '';
  is_photo_loaded = false;

  FranchiseDocumentName = FranchiseDocumentName;

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

  ViewFranchisePhoto(filename: string) {
    if(filename === FranchiseDocumentName.CENTER_HEAD_PHOTO){
      this.center_head_documnt_display_header = "Center Head Photo";
    } else if(filename === FranchiseDocumentName.CENTER_HEAD_SIGNATURE){
      this.center_head_documnt_display_header = "Center Head Signature";
    }
    
    if(this.center_head_documnt_name === filename){
      this.is_photo_loaded = true;
      return;
    }

    this.activeMatProgressBar();
    this.is_photo_loaded = false;
    this.center_head_documnt_name = filename;

    this.franchiseService.GetFileStreamByFolderAndFilename(this.center_id, this.center_head_documnt_name).subscribe({
      next: async (imageData) => {
        let base64String = await convertBlobToBase64(imageData);
        this.center_head_documnt_photo = `data:image/jpg;base64,${base64String}`;
        this.hideMatProgressBar();
        this.is_photo_loaded = true;
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR);
      }
    });
  }

  DownloadFranchisePhoto() {
    if (!this.center_head_documnt_photo) {
      this.openDialog("Franchise", "No photo available to download.", ResponseTypeColor.WARNING);
      return;
    }
  
    const link = document.createElement('a');
    link.href = this.center_head_documnt_photo;
    link.download = `${this.center_head_documnt_name}.jpg`;
    link.click();
  }

  CloseFranchisePhoto(){
    this.is_photo_loaded = false;
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
