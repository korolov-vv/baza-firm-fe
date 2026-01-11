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

    this.oauthService.configure(authCodeFlowConfig);
    
    // Setup automatic silent refresh
    this.oauthService.setupAutomaticSilentRefresh();
    
    // Debug events
    this.oauthService.events.subscribe(event => {
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
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((success) => {
      
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
      this.initResolve();
    });
  }

  async waitForInit(): Promise<void> {
    await this.initPromise;
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
