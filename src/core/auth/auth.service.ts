import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.configure();
    }
  }

  private configure(): void {
    console.log('Configuring OAuth with:', authCodeFlowConfig);
    console.log('Current URL:', window.location.href);
    console.log('URL params:', window.location.search);
    
    this.oauthService.configure(authCodeFlowConfig);
    
    // Debug events
    this.oauthService.events.subscribe(event => {
      console.log('OAuth Event:', event);
      if (event.type === 'token_received') {
        console.log('Token received! Redirecting to /account');
        this.router.navigate(['/account']);
      }
      if (event.type === 'token_error') {
        console.error('Token error:', event);
      }
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((success) => {
      console.log('Discovery document loaded and login attempted:', success);
      console.log('Has valid token:', this.oauthService.hasValidAccessToken());
      console.log('Access token:', this.oauthService.getAccessToken());
      console.log('ID token:', this.oauthService.getIdToken());
      console.log('URL after redirect:', window.location.href);
      console.log('State from URL:', new URLSearchParams(window.location.search).get('state'));
      console.log('Code from URL:', new URLSearchParams(window.location.search).get('code'));
    }).catch((error) => {
      console.error('Error loading discovery document:', error);
    });
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  register(): void {
    // Redirect to Keycloak registration page with custom parameters
    this.oauthService.initCodeFlow(undefined, {
      prompt: 'create'
    });
  }

  logout(): void {
    this.oauthService.logOut();
  }

  get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get userProfile(): any {
    return this.oauthService.getIdentityClaims();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
