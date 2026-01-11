import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isBrowser: boolean;

  constructor(
    private oauth: OAuthService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async canActivate(): Promise<boolean> {
    
    // On server-side, allow access (will be re-checked on client)
    if (!this.isBrowser) {
      return true;
    }
    
    // Check if we have tokens in storage before OAuth loads them
    const hasStoredToken = !!sessionStorage.getItem('access_token') || !!localStorage.getItem('access_token');
    
    // Wait for auth service to finish initialization
    await this.authService.waitForInit();
    
    const hasValidToken = this.oauth.hasValidAccessToken();
    
    if (hasValidToken) {
      return true;
    }
    
    sessionStorage.setItem('returnUrl', this.router.url);
    this.router.navigate(['/']);
    return false;
  }
}
