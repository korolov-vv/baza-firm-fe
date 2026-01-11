import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userProfile: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.userProfile;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToListaFirm(): void {
    this.router.navigate(['/lista-firm']);
  }
}
