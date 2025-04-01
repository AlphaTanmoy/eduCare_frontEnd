import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { EnumsService } from '../../../service/enums/enums.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { faExpandArrowsAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-enums',
  imports: [CommonModule, FontAwesomeModule, FormsModule, MatProgressBarModule],
  templateUrl: './enums.component.html',
  styleUrl: './enums.component.css'
})
export class EnumsComponent implements OnInit, OnDestroy {
  enums: any[] = [];
  filteredEnums: any[] = [];
  offsetToken: string | null = null;
  limit: number = 12;
  hasMore: boolean = true;
  isLoading: boolean = false;
  faExpandArrowsAlt = faExpandArrowsAlt;
  faSearch = faSearch;
  matProgressBarVisible: boolean = false;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  enumNames: string[] = [];
  selectedEnumName: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;

  constructor(
    private enumsService: EnumsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.activeMatProgressBar();
    this.fetchEnums();
    this.loadEnumNames();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  loadEnumNames(): void {
    this.enumsService.getEnumNames().subscribe(
      response => {
        console.log('Enum Names API Response:', response);
        if (response.status === 200 && response.data) {
          this.enumNames = response.data;
          this.hideMatProgressBar();
        } else {
          this.enumNames = [];
        }
      },
      error => {
        console.error('Error fetching enum names:', error);
        this.enumNames = [];
      }
    );
  }

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
    this.activeMatProgressBar();
    if (!this.selectedEnumName) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.enumsService.getEnumsByName(this.selectedEnumName).subscribe(
      response => {
        if (response.status === 200 && response.data) {
          this.searchResults = response.data;
        } else {
          this.searchResults = [];
        }
        this.isSearching = false;
        this.hideMatProgressBar();
      },
      error => {
        console.error('Error fetching filtered enums:', error);
        this.searchResults = [];
        this.isSearching = false;
        this.hideMatProgressBar();
      }
    );
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      this.fetchEnums();
    }
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
