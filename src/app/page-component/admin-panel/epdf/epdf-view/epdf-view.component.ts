import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Endpoints, GetBaseURL } from '../../../../endpoints/endpoints';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

interface EPDF {
  _id: string;
  code: string;
  name: string;
  link: string;
  course_codes: string[];
  upload_by: string;
  deleted_by: string;
  data_status: string;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ApiResponse {
  data: {
    epdfs: EPDF[];
  }[];
  message: string;
  status: number;
  responseType: string;
}

@Component({
  selector: 'app-epdf-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule
  ],
  templateUrl: './epdf-view.component.html',
  styleUrls: ['./epdf-view.component.css']
})
export class EpdfViewComponent implements OnInit {
  epdfs: EPDF[] = [];
  isLoading = false;
  error: string | null = null;

  matProgressBarVisible = false;
  deletingIds: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.fetchEPDFs();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  fetchEPDFs(): void {
    this.activeMatProgressBar();
    this.error = null;

    this.http.get<ApiResponse>(GetBaseURL() + Endpoints.epdf.get_epdf)
      .subscribe({
        next: (response) => {
          this.epdfs = response.data?.[0]?.epdfs || [];
          this.hideMatProgressBar();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching EPDFs:', error);
          this.error = error.error?.message || 'Failed to load EPDFs';
          this.openDialog('Error', this.error || 'An error occurred', 0, '');
          this.hideMatProgressBar();
        }
      });
  }

  deleteEPDF(epdfId: string): void {
    const epdfToDelete = this.epdfs.find(epdf => epdf._id === epdfId);
    if (!epdfToDelete || this.deletingIds.includes(epdfId)) return;

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, { 
      data: { 
        text: `Do you want to delete this EPDF?<br><br>Code: ${epdfToDelete.code}<br>Name: ${epdfToDelete.name}` 
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deletingIds = [...this.deletingIds, epdfId];
        this.activeMatProgressBar();
        
        this.http.post(GetBaseURL() + Endpoints.epdf.delete_epdf, { id: epdfId })
          .subscribe({
            next: (response: any) => {
              if (response.status === 200) {
                this.openDialog('Success', 'EPDF deleted successfully', 0, '');
              } else {
                this.openDialog(
                  'Error',
                  response.message || 'Failed to delete EPDF. Please try again.',
                  0,
                  ''
                );
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error deleting EPDF:', error);
              this.openDialog(
                'Error', 
                error.error?.message || 'Failed to delete EPDF. Please try again.', 
                0, 
                ''
              );
            },
            complete: () => {
              this.deletingIds = this.deletingIds.filter(id => id !== epdfId);
              this.hideMatProgressBar();
              // Refresh the entire list after deletion
              this.fetchEPDFs();
            }
          });
      }
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/epdf/add']);
  }

  getFileNameFromLink(link: string): string {
    try {
      const url = new URL(link);
      return url.pathname.split('/').pop() || link;
    } catch {
      return link;
    }
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string = ''): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType,
        showCancelButton: dialogType === 1 // Show cancel button for confirm dialogs
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (navigateRoute && result) {
        // Only navigate if we have a route and the user confirmed (result is true)
        this.router.navigate([navigateRoute]);
      } else if (navigateRoute === '' && result === true) {
        // For non-navigation dialogs, just close
        return;
      }
    });
  }
}
