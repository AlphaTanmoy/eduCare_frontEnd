import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ResponseTypeColor, ServerStatusType } from '../../../../constants/commonConstants';
import { ServerService } from '../../../../service/server/server.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backup',
  imports: [CommonModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.css'
})
export class BackupComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private serverService: ServerService
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible: boolean = false;

  statusClassMap: any = {
    [ServerStatusType.HEALTHY]: 'text-success',
    [ServerStatusType.HIGH_LOAD]: 'text-danger',
  };

  serverStatus: string = "";
  serverResponseTime: string = "";
  serverUptime: string = "";
  serverPlatform: string = "";
  serverCpuLoad: string = "";
  serverMemoryFree: string = "";
  serverMemoryTotal: string = "";
  currentTime: string = "";

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();

    setInterval(() => {
      const now = new Date();
      this.currentTime = GetFormattedCurrentDatetime(now);
    }, 1000);

    this.serverService.GetAllDashboardMasterData().subscribe({
      next: (response) => {
        try {
          console.log("response", response)
          if (response.status !== 200) {
            this.openDialog("Backup", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          const data = response.data[0];

          this.serverStatus = data.status;
          this.serverResponseTime = data.responseTime;
          this.serverUptime = data.uptime;
          this.serverPlatform = data.platform;
          this.serverCpuLoad = data.cpuLoad;
          this.serverMemoryFree = data.memory.free;
          this.serverMemoryTotal = data.memory.total;

        } catch (error) {
          this.openDialog("Backup", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.openDialog("Backup", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
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
