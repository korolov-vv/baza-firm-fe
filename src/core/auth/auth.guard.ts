import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private oauth: OAuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard#canActivate called with access token:', this.oauth.getAccessToken());
    if (this.oauth.hasValidAccessToken()) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
