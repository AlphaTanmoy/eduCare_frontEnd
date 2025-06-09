import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../../../../service/wallet/wallet.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { Dropdown, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pay-wallet',
  imports: [CommonModule, FormsModule, MatProgressBarModule, CustomSingleSelectSearchableDropdownComponent],
  templateUrl: './pay-wallet.component.html',
  styleUrl: './pay-wallet.component.css'
})
export class PayWalletComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  UserRole = UserRole;
  userRole: string | null = null;

  available_franchises: Dropdown[] = [];
  associated_franchise_id: string | null = null;

  existing_wallet_balance: Number | null = 0;
  recharged_wallet_balance: Number | null = null;

  constructor(
    private authService: AuthService,
    private franchiseService: FranchiseService,
    private walletService: WalletService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();

    this.userRole = this.authService.getUserRole();

    if (this.userRole === UserRole.FRANCHISE) {
      let userId = this.authService.getUserId();

      this.franchiseService.GetFranchiseIdByUserId(userId).subscribe({
        next: async (response) => {
          this.associated_franchise_id = response.data[0];
        },
        error: (err) => {
          this.hideMatProgressBar();
          this.openDialog("Franchise", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      });
    } else if (this.userRole === UserRole.MASTER || this.userRole === UserRole.ADMIN) {
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
      this.hideMatProgressBar();

      if (res.status !== 200) {
        this.openDialog("Franchise", res.message, ResponseTypeColor.ERROR, false);
        return;
      }

      res.data.forEach((element: any) => {
        this.available_franchises.push(new Dropdown(element.id, element.center_name));
      });
    } else {
      this.hideMatProgressBar();
      this.openDialog("Franchise", "You are not authorized to access this page", ResponseTypeColor.ERROR, false);
    }
  }

  handleFranchiseSelection(selectedItem: any) {
    this.associated_franchise_id = selectedItem.id ?? "";
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

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, reFetchNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (reFetchNeeded) {

      }
    });
  }
}
