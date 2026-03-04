import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  private sidebarSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.isSidebarCollapsed$.subscribe(
      (isCollapsed: boolean) => this.isSidebarCollapsed = isCollapsed
    );
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onToggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
