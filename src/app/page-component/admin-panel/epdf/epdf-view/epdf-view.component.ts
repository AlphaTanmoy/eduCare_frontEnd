import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './epdf-view.component.html',
  styleUrls: ['./epdf-view.component.css']
})
export class EpdfViewComponent implements OnInit {
  epdfs: EPDF[] = [];
  isLoading = false;
  error: string | null = null;

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
    this.isLoading = true;
    this.error = null;

    this.http.get<ApiResponse>(GetBaseURL() + Endpoints.epdf.get_epdf)
      .subscribe({
        next: (response) => {
          this.epdfs = response.data?.[0]?.epdfs || [];
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching EPDFs:', error);
          this.error = error.error?.message || 'Failed to load EPDFs';
          this.openDialog('Error', this.error || 'An error occurred', 0, '');
          this.isLoading = false;
        }
      });
  }

  deleteEPDF(epdfId: string): void {
    const epdfToDelete = this.epdfs.find(epdf => epdf._id === epdfId);
    if (!epdfToDelete) return;

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, { 
      data: { 
        text: `Do you want to delete this EPDF?<br><br>Code: ${epdfToDelete.code}<br>Name: ${epdfToDelete.name}` 
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isLoading = true;
        
        this.http.post(GetBaseURL() + Endpoints.epdf.delete_epdf, { id: epdfId })
          .subscribe({
            next: () => {
              this.epdfs = this.epdfs.filter(epdf => epdf._id !== epdfId);
              this.openDialog('Success', 'EPDF deleted successfully', 0, '');
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
              this.isLoading = false;
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
