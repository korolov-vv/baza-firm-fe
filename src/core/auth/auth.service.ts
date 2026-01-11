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
  private initResolve!: () => void;
  public initPromise: Promise<void>;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Create promise that will be resolved when initialization completes
    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve;
    });
    
    if (this.isBrowser) {
      this.configure();
    } else {
      // Resolve immediately for SSR
      this.initResolve();
    }
  }

  private configure(): void {
    console.log('Configuring OAuth with:', authCodeFlowConfig);
    
    this.oauthService.configure(authCodeFlowConfig);
    
    // Setup automatic silent refresh
    this.oauthService.setupAutomaticSilentRefresh();
    
    // Debug events
    this.oauthService.events.subscribe(event => {
      console.log('OAuth Event:', event.type);
      if (event.type === 'token_refreshed') {
        console.log('Token refreshed successfully');
      }
      if (event.type === 'token_error') {
        console.error('Token error:', event);
      }
      if (event.type === 'silent_refresh_error') {
        console.error('Silent refresh error:', event);
      }
      if (event.type === 'silent_refresh_timeout') {
        console.warn('Silent refresh timeout');
      }
      if (event.type === 'discovery_document_loaded') {
        console.log('Discovery document loaded successfully');
      }
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((success) => {
      console.log('Discovery document loaded and login attempted. Success:', success);
      console.log('Is authenticated:', this.oauthService.hasValidAccessToken());
      
      // Resolve the init promise - guards can now proceed
      this.initResolve();
      
      // Redirect after successful OAuth callback only
      const currentUrl = this.router.url;
      const isAuthenticated = this.oauthService.hasValidAccessToken();
      const hasOAuthParams = currentUrl.includes('code=') || currentUrl.includes('state=');
      
      if (isAuthenticated && hasOAuthParams) {
        const returnUrl = sessionStorage.getItem('returnUrl') || '/account';
        sessionStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      }
    }).catch((error) => {
      console.error('Error loading discovery document:', error);
      this.initResolve();
    });
  }

  async waitForInit(): Promise<void> {
    await this.initPromise;
  }

  login(): void {
    console.log('Login called');
    console.log('OAuth Service configured:', !!this.oauthService);
    console.log('Issuer:', this.oauthService.issuer);
    console.log('Client ID:', this.oauthService.clientId);
    
    if (!this.isBrowser) {
      console.error('Cannot login in SSR mode');
      return;
    }
    
    this.oauthService.initCodeFlow();
    console.log('initCodeFlow() called');
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
