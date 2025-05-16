import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { AdminService } from '../../../../service/admin/admin.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonService } from '../../../../service/common/common.service';
import { ResponseTypeColor } from '../../../../constants/commonConstants';

@Component({
  selector: 'app-create-admin',
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css'
})
export class CreateAdminComponent {
  constructor(
    private adminService: AdminService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  errorName: string | null = null;
  errorEmail: string | null = null;
  errorPhone: string | null = null;

  registeredAdminEmail: string[] = [];
  registeredAdminPhone: string[] = [];
  adminName: string = '';
  adminEmail: string = '';
  adminPhone: string = '';

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    this.commonService.getAllAvailableUsers().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, null);
            return;
          }

          this.registeredAdminEmail = response.data.map((item: any) => item.email?.toLowerCase());
          this.registeredAdminPhone = response.data.map((item: any) => item.phone?.toString());
        } catch (error) {
          this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  onAdminNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminName = input.value.trim();
  }

  onAdminEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminEmail = input.value.trim();
    this.errorEmail = null;

    if (this.registeredAdminEmail.includes(this.adminEmail.toLowerCase())) {
      this.errorEmail = "Admin with this email already exists";
    }
  }

  onAdminPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminPhone = input.value.trim();
    this.errorPhone = null;

    if (this.registeredAdminPhone.includes(this.adminPhone.toLowerCase())) {
      this.errorPhone = "Admin with this phone number already exists";
    }
  }

  submit() {
    const obj = {
      admin_name: this.adminName,
      admin_email: this.adminEmail,
      admin_phone: this.adminPhone
    }

    this.activeMatProgressBar();

    this.adminService.CreateAdmin(obj).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.hideMatProgressBar();
          this.openDialog("Admin", response.message, ResponseTypeColor.SUCCESS, "/admin-panel/manage-admin");
          return;
        }

        this.hideMatProgressBar();
        this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, null);
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  isValid(): boolean {
    return this.adminName.trim().length > 0 && this.adminEmail.trim().length > 0 && this.adminPhone.trim().length > 0 &&
      this.errorEmail === null && this.errorPhone === null && this.errorName === null;
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
}
