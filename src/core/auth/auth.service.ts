import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './auth-config';
import { ApiService } from '../services/api.service';
import { Uzytkownik } from '../models/uzytkownik.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private initResolve!: () => void;
  public initPromise: Promise<void>;
  private readonly USER_DATA_KEY = 'userData';
  
  private currentUserSubject = new BehaviorSubject<Uzytkownik | null>(null);
  public currentUser$: Observable<Uzytkownik | null> = this.currentUserSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Load user data from session storage if available
    if (this.isBrowser) {
      this.loadUserDataFromStorage();
    }
    
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
      if (event.type === 'discovery_document_loaded') {
        console.log('Discovery document loaded successfully');
      }
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((success) => {
      
      // Resolve the init promise - guards can now proceed
      this.initResolve();
      
      // Fetch user data if authenticated
      if (this.oauthService.hasValidAccessToken()) {
      }
      
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
  }

  register(): void {
    // Redirect to Keycloak registration page with custom parameters
    this.oauthService.initCodeFlow(undefined, {
      prompt: 'create'
    });
  }

  logout(): void {
    this.clearUserData();
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

  get currentUser(): Uzytkownik | null {
    return this.currentUserSubject.value;
  }

  /**
   * Fetches user data from the backend and stores it in session storage
   */
  fetchUserData(): Observable<Uzytkownik> {
    return this.apiService.get<Uzytkownik>('uzytkownicy/me').pipe(
      tap(userData => {
        this.setUserData(userData);
      })
    );
  }

  /**
   * Stores user data in session storage and updates the observable
   */
  private setUserData(userData: Uzytkownik): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }
    this.currentUserSubject.next(userData);
  }

  /**
   * Loads user data from session storage
   */
  private loadUserDataFromStorage(): void {
    if (this.isBrowser) {
      const stored = sessionStorage.getItem(this.USER_DATA_KEY);
      if (stored) {
        try {
          const userData = JSON.parse(stored) as Uzytkownik;
          this.currentUserSubject.next(userData);
        } catch (error) {
          console.error('Failed to parse user data from storage:', error);
          sessionStorage.removeItem(this.USER_DATA_KEY);
        }
      }
    }
  }

  /**
   * Clears user data from session storage
   */
  private clearUserData(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.USER_DATA_KEY);
    }
    this.currentUserSubject.next(null);
  }
}
