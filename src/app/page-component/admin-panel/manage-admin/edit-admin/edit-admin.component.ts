import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { AdminService } from '../../../../service/admin/admin.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonService } from '../../../../service/common/common.service';
import { ActiveInactiveStatus, ResponseTypeColor } from '../../../../constants/commonConstants';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-admin',
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent {
  constructor(
    private adminService: AdminService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  ActiveInactiveStatus = ActiveInactiveStatus;

  admin_id: string = '';

  errorName: string | null = null;
  errorEmail: string | null = null;
  errorPhone: string | null = null;

  registeredAdminEmail: string[] = [];
  registeredAdminPhone: string[] = [];

  adminInfoOld: any = {};
  adminName: string = '';
  adminEmail: string = '';
  adminPhone: string = '';
  admin_data_status: string = '';

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.admin_id = this.route.snapshot.paramMap.get('adminId')!;

    this.commonService.getAllAvailableUsers().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.openDialog("Admin", response.message, ResponseTypeColor.ERROR, null);
            return;
          }

          this.adminInfoOld = response.data.filter((item: any) => item._id === this.admin_id)[0];
          this.registeredAdminEmail = response.data.filter((item: any) => item._id !== this.admin_id).map((item: any) => item.email?.toLowerCase());
          this.registeredAdminPhone = response.data.filter((item: any) => item._id !== this.admin_id).map((item: any) => item.phone?.toString());

          this.updateDefaultAdminInfo();
        } catch (error) {
          this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.openDialog("Admin", "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  updateDefaultAdminInfo() {
    this.adminName = this.adminInfoOld.user_name;
    this.adminEmail = this.adminInfoOld.email;
    this.adminPhone = this.adminInfoOld.phone;
    this.admin_data_status = this.adminInfoOld.data_status;
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
      this.errorEmail = "An user with this email already exists";
    }
  }

  onAdminPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.adminPhone = input.value;
    this.errorPhone = null;

    if (this.registeredAdminPhone.includes(this.adminPhone.toLowerCase())) {
      this.errorPhone = "An user with this phone number already exists";
    }
  }

  onStatusChange(isChecked: boolean) {
    this.admin_data_status = isChecked ? ActiveInactiveStatus.ACTIVE : ActiveInactiveStatus.INACTIVE;
  }

  submit() {
    const obj = {
      admin_id: this.admin_id,
      admin_name: this.adminName,
      admin_email: this.adminEmail,
      admin_phone: this.adminPhone,
      data_status: this.admin_data_status
    }

    this.activeMatProgressBar();

    this.adminService.EditAdmin(obj).subscribe({
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
    return this.adminName.trim().length > 0 && this.adminEmail.trim().length > 0 && parseInt(this.adminPhone) > 0 &&
      this.errorEmail === null && this.errorPhone === null && this.errorName === null && (this.adminName !== this.adminInfoOld.user_name ||
        this.adminEmail !== this.adminInfoOld.email || this.adminPhone !== this.adminInfoOld.phone ||
        this.admin_data_status !== this.adminInfoOld.data_status);
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
