import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { ResponseTypeColor, ServerStatusType } from '../../../../constants/commonConstants';
import { ServerService } from '../../../../service/server/server.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { GetFormattedCurrentDatetime } from '../../../../utility/common-util'
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-backup',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.css'
})
export class BackupComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private serverService: ServerService,
    private http: HttpClient
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
  socket: Socket | null = null;
  socketId: any = '';
  messages: string[] = [];

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

  async StartBackup(): Promise<void> {
    this.isBackupStarted = true;

    await this.connectSocket();

    this.serverService.BackupAccessControlCategoryData(this.socketId, this.schemaDetails[0].schemaId).subscribe({
      next: () => {
        console.log('✅ Backup API called successfully');
      },
      error: (err) => {
        console.error('❌ Error calling Backup API:', err);
      }
    });
  }

  connectSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io('http://localhost:4000');

      this.socket.on('connect', () => {
        this.socketId = this.socket!.id;
        console.log('🟢 Socket connected with ID:', this.socketId);
        resolve();
      });

      this.socket.on('task-progress', (data) => {
        this.messages.push(data.message);
        const targetItem = this.schemaDetails.find(item => item.schemaId === data.schemaId);
        if (targetItem) {
          targetItem.progress = data.step * 20;
        }
      });

      this.socket.on('disconnect', () => {
        console.log('🔴 Disconnected from socket');
      });

      this.socket.on('connect_error', (err) => {
        console.error('❌ Socket connection failed:', err);
        reject(err);
      });
    });
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
