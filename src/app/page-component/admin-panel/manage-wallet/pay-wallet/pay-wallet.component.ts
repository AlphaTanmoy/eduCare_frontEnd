import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../../../../service/wallet/wallet.service';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomSingleSelectSearchableDropdownComponent } from '../../../../common-component/custom-single-select-searchable-dropdown/custom-single-select-searchable-dropdown.component';
import { Dropdown, EducareFranchiseWalletRechargeBankDetails, ResponseTypeColor, UserRole } from '../../../../constants/commonConstants';
import { AuthService } from '../../../../service/auth/Auth.Service';
import { FranchiseService } from '../../../../service/franchise/franchise.service';
import { firstValueFrom } from 'rxjs';
import { convertBlobToBase64 } from '../../../../utility/common-util';

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

  EducareFranchiseWalletRechargeBankDetails = EducareFranchiseWalletRechargeBankDetails;

  UserRole = UserRole;
  userRole: string | null = null;

  available_franchises: Dropdown[] = [];
  associated_franchise_id: string | null = null;

  is_qr_loaded = false;
  franchise_wallet_recharge_qr_code: string = '';

  existing_wallet_balance: Number | null = null;
  recharged_wallet_balance: Number | null = null;
  total_wallet_balance: Number | null = 0;
  transaction_id: string | null = null;
  transaction_proof_photo: File | null = null;

  constructor(
    private authService: AuthService,
    private franchiseService: FranchiseService,
    private walletService: WalletService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();

    this.franchiseService.GetFranchiseWalletRechargeQrCode().subscribe({
      next: async (imageData) => {
        let base64String = await convertBlobToBase64(imageData);
        this.franchise_wallet_recharge_qr_code = `data:image/jpg;base64,${base64String}`;
        this.is_qr_loaded = true;

        this.userRole = this.authService.getUserRole();

        if (this.userRole === UserRole.FRANCHISE) {
          let userId = this.authService.getUserId();

          this.franchiseService.GetFranchiseIdByUserId(userId).subscribe({
            next: async (response) => {
              this.hideMatProgressBar();

              if (response.status !== 200) {
                this.openDialog("Wallet", response.message, ResponseTypeColor.ERROR, false);
                return;
              }

              this.associated_franchise_id = response.data[0];
            },
            error: (err) => {
              this.hideMatProgressBar();
              this.openDialog("Wallet", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
            }
          });
        } else if (this.userRole === UserRole.MASTER || this.userRole === UserRole.ADMIN) {
          const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchisesAndItsCourseDetails());
          this.hideMatProgressBar();

          if (res.status !== 200) {
            this.openDialog("Wallet", res.message, ResponseTypeColor.ERROR, false);
            return;
          }

          res.data.forEach((element: any) => {
            this.available_franchises.push(new Dropdown(element.id, element.center_name));
          });
        } else {
          this.hideMatProgressBar();
          this.openDialog("Wallet", "You are not authorized to access this page", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Wallet", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  handleFranchiseSelection(selectedItem: any) {
    this.associated_franchise_id = selectedItem.id ?? null;
  }

  UpdateTotalWalletBalance() {
    const existing = Number(this.existing_wallet_balance);
    const recharged = Number(this.recharged_wallet_balance);

    if (!isNaN(existing) && !isNaN(recharged)) {
      this.total_wallet_balance = existing + recharged;
    } else {
      this.total_wallet_balance = null;
    }
  }

  handleTransactionProofSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.transaction_proof_photo = input.files[0];
    }
  }

  submit() {
    const wallet = new FormData();

    if (this.transaction_proof_photo instanceof File) {
      wallet.append("file", this.transaction_proof_photo);
    }

    wallet.append("associated_franchise_id", String(this.associated_franchise_id || null));
    wallet.append("recharged_wallet_balance", String(this.recharged_wallet_balance || null));
    wallet.append("transaction_id", String(this.transaction_id || null));

    this.activeMatProgressBar();

    this.walletService.RechargeWallet(wallet).subscribe({
      next: async (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.openDialog("Wallet", response.message, ResponseTypeColor.SUCCESS, false);
        } else {
          this.openDialog("Wallet", response.message, ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Wallet", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  isNotValid(): boolean {
    return !this.associated_franchise_id || !this.recharged_wallet_balance || !this.transaction_id || !this.transaction_proof_photo;
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
