import { Component, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { EnumsService } from '../../service/enums/enums.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

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

  enumNames: string[] = [];
  selectedEnumName: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;

  constructor(
    private enumsService: EnumsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
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
