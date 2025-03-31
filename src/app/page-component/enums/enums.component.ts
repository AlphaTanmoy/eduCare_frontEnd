import { Component, HostListener, OnInit } from '@angular/core';
import { EnumsService } from '../../service/enums/enums.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-enums',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './enums.component.html',
  styleUrls: ['./enums.component.css']
})
export class EnumsComponent implements OnInit {
  enums: any[] = [];
  offsetToken: string | null = null;
  limit: number = 12;
  hasMore: boolean = true;
  isLoading: boolean = false;
  faExpandArrowsAlt = faExpandArrowsAlt;

  constructor(private enumsService: EnumsService) {}

  ngOnInit(): void {
    this.fetchEnums();
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      this.fetchEnums();
    }
  }
}
