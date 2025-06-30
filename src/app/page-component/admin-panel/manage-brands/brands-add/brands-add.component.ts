import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MasterDataService } from '../../../../service/master-data/master-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';

@Component({
  selector: 'app-brands-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './brands-add.component.html',
  styleUrls: ['./brands-add.component.css']
})
export class BrandsAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  brandForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.brandForm = this.fb.group({
      brandName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    if (this.bootstrapElements) {
      removeBootstrap(this.bootstrapElements);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      
      // Validate file type
      if (!file.type.match('image.*')) {
        this.error = 'Only image files are allowed';
        this.previewUrl = null;
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.error = 'Image size should not exceed 2MB';
        this.previewUrl = null;
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        return;
      }
      
      this.error = null;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    // Mark all form controls as touched to trigger validation messages
    this.brandForm.markAllAsTouched();
    
    if (this.brandForm.invalid || !this.selectedFile) {
      if (!this.selectedFile) {
        this.error = 'Please select a brand logo';
      }
      return;
    }

    this.isLoading = true;
    this.error = null;

    const brandName = this.brandForm.get('brandName')?.value;
    const description = this.brandForm.get('description')?.value;

    this.masterDataService.createBrand(brandName, description, this.selectedFile).subscribe({
      next: (response: any) => {
        if (response?.responseType === 'SUCCESS') {
          this.openDialog('Success', 'Brand added successfully', ResponseTypeColor.SUCCESS, false);
          this.router.navigate(['/control-panel/add-brand']);
        } else {
          const errorMessage = response?.message || 'Failed to add brand. Please try again.';
          this.error = errorMessage;
          this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error adding brand:', error);
        const errorMessage = error.error?.message || 'Failed to add brand. Please try again.';
        this.error = errorMessage;
        this.openDialog('Error', errorMessage, ResponseTypeColor.ERROR, false);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.brandForm.dirty || this.previewUrl) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.router.navigate(['/control-panel/add-brand']);
      }
    } else {
      this.router.navigate(['/control-panel/add-brand']);
    }
  }

  private openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean = false): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      data: {
        title: dialogTitle,
        text: dialogText,
        type: dialogType
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (pageReloadNeeded) {
        location.reload();
      }
    });
  }
}
