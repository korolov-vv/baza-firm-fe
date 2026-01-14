import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { filter } from 'rxjs/operators';
import { Uzytkownik } from '../../core/models/uzytkownik.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-header.component.html',
  styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent implements OnInit, OnDestroy {
  userData: Uzytkownik | null = null;
  currentRoute: string = '';
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => this.userData = user
    );
    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
