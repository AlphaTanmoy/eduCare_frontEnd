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

  StartBackup() : void {
    this.isBackupStarted = true;
    this.connectSocket();
  }


  connectSocket() {
    this.socket = io('http://localhost:4000');

    this.socket.on('connect', () => {
      this.socketId = this.socket!.id;
      console.log('🟢 Socket connected with ID:', this.socketId);
    });

    this.socket.on('task-progress', (data) => {
      this.messages.push(data.message);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Disconnected from socket');
    });
  }

  startTask() {
    if (!this.socket || !this.socket.connected) {
      this.connectSocket();

      // Wait for connection to establish
      setTimeout(() => this.connectSocket(), 500);
    } else {
      this.connectSocket();
    }
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
