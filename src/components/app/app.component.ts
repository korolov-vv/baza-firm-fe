import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Uzytkownik } from '../../core/models/uzytkownik.model';
import { SidebarService } from '../../core/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly title = signal('baza-firm-fe');
  isAuthenticated = false;
  isSidebarCollapsed = false;
  private authSubscription?: Subscription;
  private sidebarSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(
      (user: Uzytkownik | null) => this.isAuthenticated = user !== null
    );

    this.sidebarSubscription = this.sidebarService.isSidebarCollapsed$.subscribe(
      (isCollapsed: boolean) => this.isSidebarCollapsed = isCollapsed
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.sidebarSubscription?.unsubscribe();
  }
}
