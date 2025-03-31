import { Component, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { EnumsService } from '../../service/enums/enums.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap'

@Component({
  selector: 'app-enums',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './enums.component.html',
  styleUrls: ['./enums.component.css']
})

export class EnumsComponent implements OnInit, OnDestroy {
  enums: any[] = [];
  filteredEnums: any[] = [];
  offsetToken: string | null = null;
  limit: number = 12;
  hasMore: boolean = true;
  isLoading: boolean = false;
  faExpandArrowsAlt = faExpandArrowsAlt;

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  selectedEnumName: string = ''; // Search input
  searchResults: any[] = []; // Holds search results
  isSearching: boolean = false; // Loading state for search

  constructor(
    private enumsService: EnumsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.fetchEnums();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  // private loadBootstrap(): void {
  //   this.bootstrapCss = this.renderer.createElement('link');
  //   this.bootstrapCss.rel = 'stylesheet';
  //   this.bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  //   document.head.appendChild(this.bootstrapCss);

  //   this.bootstrapJs = this.renderer.createElement('script');
  //   this.bootstrapJs.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
  //   this.bootstrapJs.type = 'text/javascript';
  //   document.body.appendChild(this.bootstrapJs);
  // }

  // private removeBootstrap(): void {
  //   if (this.bootstrapCss) {
  //     document.head.removeChild(this.bootstrapCss);
  //     this.bootstrapCss = null;
  //   }
  //   if (this.bootstrapJs) {
  //     document.body.removeChild(this.bootstrapJs);
  //     this.bootstrapJs = null;
  //   }
  // }

  fetchEnums(): void {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    this.enumsService.getAllEnums(this.offsetToken, this.limit).subscribe(
      response => {
        if (response.status === 200 && response.data) {
          this.enums = [...this.enums, ...response.data];
          this.offsetToken = response.pagination?.offsetToken || null;
          this.hasMore = !!this.offsetToken;
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching enums:', error);
        this.isLoading = false;
      }
    );
  }

  filterEnums(): void {
    if (!this.selectedEnumName.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.enumsService.getEnumsByName(this.selectedEnumName).subscribe(
      response => {
        if (response.status === 200 && response.data) {  // Check correct response structure
          this.searchResults = response.data;  // Update with correct response field
        } else {
          this.searchResults = [];
        }
        this.isSearching = false;
      },
      error => {
        console.error('Error fetching filtered enums:', error);
        this.searchResults = [];
        this.isSearching = false;
      }
    );
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      this.fetchEnums();
    }
  }
}
