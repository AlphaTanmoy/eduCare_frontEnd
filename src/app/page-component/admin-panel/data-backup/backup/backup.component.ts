import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ResponseTypeColor, ServerStatusType } from '../../../../constants/commonConstants';
import { ServerService } from '../../../../service/server/server.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util'
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-backup',
  imports: [CommonModule, MatProgressBarModule],
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
  matProgressBarVisible: boolean = true;

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

  schemaDetails: any[] = [];

  isBackupStarted: boolean = false;

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();

    setInterval(() => {
      const now = new Date();
      this.currentTime = GetFormattedCurrentDatetime(now);
    }, 1000);

    this.serverService.GetServerStatus().subscribe({
      next: (response) => {
        try {
          if (response.status !== 200) {
            this.hideMatProgressBar();
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


    this.serverService.GetAllDatabaseSchemaDetails().subscribe({
      next: (response) => {
        try {
          console.log("response", response)
          if (response.status !== 200) {
            this.hideMatProgressBar();
            this.openDialog("Backup", response.message, ResponseTypeColor.ERROR, false);
            return;
          }

          this.schemaDetails = response.data;

          this.hideMatProgressBar();
        } catch (error) {
          this.hideMatProgressBar();
          this.openDialog("Backup", "Internal server error", ResponseTypeColor.ERROR, false);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Backup", "Internal server error", ResponseTypeColor.ERROR, false);
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  StartBackup() : void {
    this.isBackupStarted = true;
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
