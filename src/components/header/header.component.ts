import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.waitForInit();
    this.isAuthenticated = this.authService.isAuthenticated;
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
}
