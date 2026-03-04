import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Uzytkownik } from '../../core/models/uzytkownik.model';
import { ApiService } from '../../core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  userData: Uzytkownik | null = null;
  todayContactCount = 0;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => this.userData = user
    );

    this.apiService.get<number>('v1/firmy/do-kontaktu-dzis/ilosc').subscribe({
      next: (count: number) => {
        this.todayContactCount = count;
      },
      error: (error) => console.error('Failed to load daily contact count:', error)
    });
    
    // Fetch user data if not already loaded
    if (!this.authService.currentUser) {
      this.authService.fetchUserData().subscribe({
        error: (error) => console.error('Failed to load user data:', error)
      });
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  navigateToListaFirm(): void {
    this.router.navigate(['/account/lista-firm']);
  }
}
