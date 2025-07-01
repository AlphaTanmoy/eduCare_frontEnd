import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { CustomConfirmDialogComponent } from '../../../../common-component/custom-confirm-dialog/custom-confirm-dialog.component';
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

interface Brand {
  _id?: string;
  id?: string;
  brand_name: string;
  brand_image?: string;
  image?: string;
  imageUrl?: string;
  blob?: {
    id: string;
    name: string;
    data: string; // base64 image string
  };
  description?: string;
  external_link?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: {
    _id: string;
    email: string;
  };
  status: boolean;
}

@Component({
  selector: 'app-brands-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './brands-management.component.html',
  styleUrls: ['./brands-management.component.css']
})
export class BrandsManagementComponent implements OnInit, OnDestroy {
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  lastUpdated: Date | null = null;
  private subscriptions = new Subscription();

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  constructor(
    private masterDataService: MasterDataService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.loadBrands();
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }

  loadBrands(): void {
    this.isLoading = true;
    this.error = null;

    const sub = this.masterDataService.getBrands().subscribe({
      next: (response: any) => {
        try {
          if (response && Array.isArray(response.data) && response.data.length > 0) {
            const allBrands = response.data.flatMap((item: any) => 
              (item.brands || []).map((brand: any) => ({
                ...brand,
                _id: brand._id,
                brand_name: brand.brand_name,
                external_link: brand.external_link,
                blob: brand.blob ? {
                  id: brand.blob.id,
                  name: brand.blob.name,
                  data: brand.blob.data
                } : null
              }))
            );
            this.brands = allBrands;
            this.filteredBrands = [...allBrands];
            this.lastUpdated = new Date();
          } else {
            this.brands = [];
            this.filteredBrands = [];
            this.error = 'No brands data available';
          }
        } catch (error) {
          console.error('Error processing brands data:', error);
          this.error = 'Error processing brands data';
          this.brands = [];
          this.filteredBrands = [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error?.error?.message || 'Failed to load brands. Please try again later.';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.add(sub);
  }

  filterBrands(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBrands = [...this.brands];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredBrands = this.brands.filter(brand =>
      (brand.brand_name && brand.brand_name.toLowerCase().includes(query)) ||
      (brand.description && brand.description.toLowerCase().includes(query))
    );
  }

  getImageUrl(brand: Brand): string {
    if (!brand) {
      return 'image//placeholder-brand.png';
    }
    
    // Check for blob data first
    if (brand.blob && brand.blob.data) {
      return brand.blob.data;
    }
    
    // Check different possible image properties
    const imageUrl = brand.brand_image || brand.image || brand.imageUrl || '';
    
    if (!imageUrl) {
      return 'image//placeholder-brand.png';
    }
    
    if (typeof imageUrl === 'string' && 
        (imageUrl.startsWith('data:image') || imageUrl.startsWith('blob:'))) {
      return imageUrl;
    }
    
    if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    if (typeof imageUrl === 'string' && 
        (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    
    return 'image//placeholder-brand.png';
  }

  onImageError(event: Event, brand: Brand): void {
    const img = event.target as HTMLImageElement;
    img.src = 'image//placeholder-brand.png';
    if (brand) {
      brand.brand_image = 'image//placeholder-brand.png';
    }
  }

  openDialog(title: string, message: string, type: ResponseTypeColor, reload: boolean = false): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: title,
        text: message,
        type: type
      },
      width: '500px',
      panelClass: 'custom-dialog-container',
      disableClose: true
    });

    if (reload) {
      dialogRef.afterClosed().subscribe(() => {
        this.loadBrands();
      });
    }
  }

  deleteBrand(brandId: string | undefined): void {
    if (!brandId) {
      console.error('Cannot delete brand: No brand ID provided');
      this.openDialog('Error', 'Invalid brand ID', ResponseTypeColor.ERROR);
      return;
    }

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, {
      data: {
        text: 'Are you sure you want to delete this brand? This action cannot be undone.'
      },
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        const sub = this.masterDataService.deleteBrand(brandId).subscribe({
          next: () => {
            this.openDialog('Success', 'Brand deleted successfully', ResponseTypeColor.SUCCESS, true);
            this.brands = this.brands.filter(brand => brand._id !== brandId);
            this.filteredBrands = this.filteredBrands.filter(brand => brand._id !== brandId);
            this.lastUpdated = new Date();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting brand:', error);
            this.openDialog('Error', error?.error?.message || 'Failed to delete brand', ResponseTypeColor.ERROR);
            this.isLoading = false;
          }
        });
        this.subscriptions.add(sub);
      }
    });
  }
}