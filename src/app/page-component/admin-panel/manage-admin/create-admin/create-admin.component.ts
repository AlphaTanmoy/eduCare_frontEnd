import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { AdminService } from '../../../../service/admin/admin.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-create-admin',
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css'
})
export class CreateAdminComponent {
  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  adminName: string = '';
  adminEmail: string = '';
  adminPhone: string = '';

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
  }

  onAdminNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminName = input.value.trim();
  }

  onAdminEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminEmail = input.value.trim();
  }

  onAdminPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminPhone = input.value.trim();
  }

  submit(){
    
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
