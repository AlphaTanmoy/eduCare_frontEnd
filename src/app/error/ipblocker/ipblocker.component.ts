import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-ipblocker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ipblocker.component.html',
  styleUrls: ['./ipblocker.component.css']
})
export class IpblockerComponent implements OnInit, OnDestroy {
  remainingTime: number = 0;
  private countdownSubscription!: Subscription;
  private readonly BLOCK_TIME_KEY = 'ipblocker_open_time';
  private readonly COUNTDOWN_INTERVAL = 1000; // 1 second

  ngOnInit(): void {
    this.initializeCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private initializeCountdown(): void {
    // Get the stored block time from session storage
    const blockTimeStr = sessionStorage.getItem(this.BLOCK_TIME_KEY);
    
    if (blockTimeStr) {
      const blockTime = parseInt(blockTimeStr, 10);
      const currentTime = new Date().getTime();
      this.remainingTime = Math.max(0, Math.ceil((blockTime - currentTime) / 1000));
      
      // Start the countdown if there's still time remaining
      if (this.remainingTime > 0) {
        this.startCountdown();
      }
    }
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(this.COUNTDOWN_INTERVAL).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  formatTime(seconds: number): string {
    if (seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  refreshPage(): void {
    if (this.remainingTime <= 0) {
      window.location.reload();
    }
  }
}
