import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../service/contact/contact.service';
import { finalize } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../constants/commonConstants';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

interface Contact {
  _id: string;
  contact_email_id: string;
  contact_subject: string;
  contact_message: string;
  contact_ticket_code: string;
  is_read: boolean;
  acknowledgment_message?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-view-contact-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './view-contact-lists.component.html',
  styleUrls: ['./view-contact-lists.component.css']
})
export class ViewContactListsComponent implements OnInit {
  @ViewChild('searchInput') searchInput: any;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchTerm: string = '';
  sortField: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  loading: boolean = false;
  showProgressBar: boolean = false;

  private dialog = inject(MatDialog);
  
  constructor(
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.bootstrapElements = loadBootstrap();
  }

  loadContacts(): void {
    this.loading = true;
    this.showProgressBar = true;

    const offset = (this.currentPage - 1) * this.itemsPerPage;
    
    this.contactService.getAllContacts(
      offset,
      this.itemsPerPage,
      this.searchTerm,
      this.sortField,
      this.sortOrder
    ).pipe(
      finalize(() => {
        this.loading = false;
        this.showProgressBar = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.contacts = response.data || [];
        this.filteredContacts = [...this.contacts];
        this.totalItems = response.pagination?.total || this.contacts.length;
        
        // Log for debugging
        console.log('Contacts loaded:', {
          contacts: this.contacts,
          pagination: response.pagination,
          totalItems: this.totalItems
        });
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.openDialog('Error', 'Failed to load contacts. Please try again later.', ResponseTypeColor.ERROR, false);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadContacts();
    // Set focus back to search input
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  onSort(field: string): void {
    // Toggle sort order if clicking the same field, otherwise set to ascending
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1; // Reset to first page when changing sort
    this.loadContacts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadContacts();
    window.scrollTo(0, 0);
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'bi-arrow-down-up';
    return this.sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getEndItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxPagesToShow = 5;
    const pages: number[] = [];
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(totalPages - 1, this.currentPage + 1);
      
      // Adjust if we're near the start or end
      if (this.currentPage <= 3) {
        endPage = 4;
      } else if (this.currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  markAsRead(contact: Contact, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (contact.is_read) {
      return; // Don't do anything if already read
    }

    const message = prompt('Please enter your acknowledgment message:');
    if (!message || message.trim() === '') {
      this.openDialog('Error', 'Acknowledgment message is required.', ResponseTypeColor.ERROR, false);
      return;
    }

    this.contactService.markAsRead(contact._id, message).subscribe({
      next: (response) => {
        // Update the local state to reflect the change
        contact.is_read = true;
        contact.acknowledgment_message = response.data.acknowledgment_message;
        this.openDialog('Success', 'Message marked as read and acknowledgment sent.', ResponseTypeColor.SUCCESS, false);
      },
      error: (error) => {
        console.error('Error marking contact as read:', error);
        this.openDialog('Error', 'Failed to mark message as read. ' + (error.error?.message || ''), ResponseTypeColor.ERROR, false);
      }
    });
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { 
      data: { 
        title: dialogTitle, 
        text: dialogText, 
        type: dialogType 
      } 
    });

    dialogRef.afterClosed().subscribe(() => {
      if (pageReloadNeeded) {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
