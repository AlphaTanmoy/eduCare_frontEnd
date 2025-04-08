import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../service/admin/admin.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDBItemKey, ResponseTypeColor } from '../../../../constants/commonConstants';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-master-details',
  imports: [FormsModule, MatProgressBarModule],
  templateUrl: './master-details.component.html',
  styleUrl: './master-details.component.css'
})

export class MasterDetailsComponent implements OnInit, OnDestroy {
  email: string = "1";
  phone1: string = "2";
  phone2: string = "2";
  facebook: string = "3";
  youtube: string = "4";
  whatsapp: string = "5";

  readonly dialog = inject(MatDialog);
  matProgressBarVisible: boolean = true;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  saveEmail(): void {
    this.activeMatProgressBar();

    console.log("email", this.email);
    this.adminService.UploadDashboardEmailID(this.email).subscribe({
      next: (response) => {
        this.hideMatProgressBar();
        console.log(response)

        if (response.status === 200) {
          this.openDialog("Master Data", response.message, ResponseTypeColor.SUCCESS, false);
          return;
        }

        this.openDialog("Master Data", response.message, ResponseTypeColor.ERROR, false);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Master Data", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  savePhone(phoneType: string): void {
    console.log("phone1", this.phone1);
    console.log("phone2", this.phone2);
  }

  saveFacebook(): void {
    console.log("facebook", this.facebook);
  }

  saveYoutube(): void {
    console.log("youtube", this.youtube);
  }

  saveWhatsapp(): void {
    console.log("whatsapp", this.whatsapp);
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }
}
