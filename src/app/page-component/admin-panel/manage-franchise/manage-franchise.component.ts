import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { FranchiseService } from '../../../service/franchise/franchise.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { firstValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-manage-franchise',
  standalone: true,
  imports: [MatTableModule, MatPaginator],
  templateUrl: './manage-franchise.component.html',
  styleUrl: './manage-franchise.component.css'
})
export class ManageFranchiseComponent implements OnInit, OnDestroy, AfterViewInit {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  page_size: number = 2;
  page_index: number = 0;
  franchise_list: any[] = [];
  totalCount: number = 0;

  displayedColumns: string[] = ['name', 'email'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private franchiseService: FranchiseService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    await this.getFranchises(this.page_index, this.page_size);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(async (event) => {
      this.page_index = event.pageIndex;
      this.page_size = event.pageSize;
      await this.getFranchises(this.page_index, this.page_size);
    });
  }

  async getFranchises(page: number, size: number) {
    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.franchiseService.GetAllAvailableFranchises(page, size));
      this.franchise_list = res.data;
      this.totalCount = 5; // make sure your backend sends this
      console.log("this.franchise_list", this.franchise_list)
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
    } finally {
      this.hideMatProgressBar();
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
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
