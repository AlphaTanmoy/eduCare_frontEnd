import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

interface MasterDataItem {
  master_data_type: string;
  master_data_value: string;
}

interface ApiResponse {
  status: number;
  data: MasterDataItem[];
  [key: string]: any;
}

interface StatItem {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-home-happy-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-happy-students.component.html',
  styleUrls: ['./home-happy-students.component.css']
})
export class HomeHappyStudentsComponent implements OnInit, OnDestroy {
  stats: StatItem[] = [
    { title: 'Total Franchise', value: 0, icon: 'store', color: 'primary' },
    { title: 'Happy Students', value: 0, icon: 'emoji_emotions', color: 'success' },
    { title: 'Total Students', value: 0, icon: 'school', color: 'info' }
  ];
  private animationFrameId: number | null = null;
  private readonly animationDuration: number = 2000; // 2 seconds
  
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
    this.loadStats();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
    this.cancelAnimation();
  }

  private loadStats(): void {
    this.dashboardService.getAllDashboardMasterData().subscribe({
      next: (response: ApiResponse) => {
        if (response.status === 200 && response.data) {
          // Extract values from the API response
          const franchise = this.extractStatValue(response.data, 'TOTAL_FRANCHISE');
          const happyStudents = this.extractStatValue(response.data, 'HAPPY_STUDENT');
          const totalStudents = this.extractStatValue(response.data, 'TOTAL_STUDENT');

          // Start animation for each stat
          this.animateValue(0, franchise, 0);
          this.animateValue(1, happyStudents, 200);
          this.animateValue(2, totalStudents, 400);
        }
      },
      error: (error: Error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  private extractStatValue(data: MasterDataItem[], type: string): number {
    const item = data.find(d => d.master_data_type === type);
    return item ? parseInt(item.master_data_value, 10) || 0 : 0;
  }

  private animateValue(statIndex: number, target: number, delay: number): void {
    const startValue = 0;
    const startTime = Date.now() + delay;
    
    const updateCount = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed <= 0) {
        this.animationFrameId = requestAnimationFrame(updateCount);
        return;
      }
      
      const progress = Math.min(elapsed / this.animationDuration, 1);
      const currentValue = Math.floor(progress * (target - startValue) + startValue);
      
      this.stats[statIndex].value = currentValue;
      
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(updateCount);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(updateCount);
  }

  private cancelAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Helper method to create staggered animation delays
  getAnimationDelay(index: number): number {
    return index * 100; // 100ms delay between each card
  }
}
