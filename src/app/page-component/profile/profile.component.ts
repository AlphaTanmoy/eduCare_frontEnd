import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordService, UserProfile } from '../../service/password/password.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private passwordService: PasswordService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.passwordService.getUserProfile().subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.length > 0) {
          this.userProfile = response.data[0].user;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load profile. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
