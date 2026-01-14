import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountHeaderComponent } from '../account-header/account-header.component';
import { Uzytkownik } from '../../core/models/uzytkownik.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [CommonModule, AccountHeaderComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  userData: Uzytkownik | null = null;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => this.userData = user
    );
    
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
