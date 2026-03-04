import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Uzytkownik } from '../../core/models/uzytkownik.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isSidebarCollapsed = false;
  userData: Uzytkownik | null = null;
  private userSubscription?: Subscription;
  private sidebarSubscription?: Subscription;
  
  
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.waitForInit();
    this.isAuthenticated = this.authService.isAuthenticated;
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => this.userData = user
    );
    console.log('Header initialized, authenticated:', this.isAuthenticated);
  }

  onLogin(): void {
    console.log('Login button clicked');
    this.authService.login();
  }

  onRegister(): void {
    console.log('Register button clicked');
    this.authService.register();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onAccount(): void {
    this.router.navigate(['/account']);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.sidebarSubscription?.unsubscribe();
  }

  setNazwaFirmy() {
    if (!this.userData) {
      return 'Baza firm';
    } else {
      if (this.userData?.nazwaFirmy.includes('SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ')) {
        return this.userData.nazwaFirmy.replace('SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', 'SP. Z O.O.');
      }
      return this.userData.nazwaFirmy;
    }
  }
}
