import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FranchiseService } from '../../../service/franchise/franchise.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { firstValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table'; 

@Component({
  selector: 'app-manage-franchise',
  imports: [MatTableModule, MatPaginator],
  templateUrl: './manage-franchise.component.html',
  styleUrl: './manage-franchise.component.css'
})
export class ManageFranchiseComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 2;
  franchise_list: any[] = [];
  totalCount: number = 0;

  displayedColumns: string[] = ['name', 'email'];
  dataSource: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    await this.getFranchises();
  }

  async getFranchises() {
    try {
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchises(0, this.page_size));
      this.franchise_list = res.data;
      this.dataSource = res.data;
      console.log("this.franchise_list", this.franchise_list);
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
    }
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
