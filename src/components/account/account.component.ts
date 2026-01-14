import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountHeaderComponent } from '../account-header/account-header.component';

@Component({
  selector: 'app-account',
  imports: [CommonModule, AccountHeaderComponent],
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

  navigateToListaFirm(): void {
    this.router.navigate(['/account/lista-firm']);
  }
}
