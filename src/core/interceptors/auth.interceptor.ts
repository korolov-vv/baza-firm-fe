import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);
  
  // Skip interceptor for OAuth/Keycloak endpoints to avoid circular dependency
  if (req.url.includes('.well-known') || 
      req.url.includes('/protocol/openid-connect') ||
      req.url.includes('/realms/')) {
    return next(req);
  }
  
  // Only add token for API requests to our backend
  if (req.url.includes('/api/')) {
    const token = oauthService.getAccessToken();
    
    if (token) {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('401 Unauthorized - Token might be expired');
            // Optionally redirect to login
            // router.navigate(['/']);
          }
          return throwError(() => error);
        })
      );
    } else {
      console.warn('No token available for API request');
    }
  }
  
  // If no token or not an API request, proceed without modification
  return next(req);
};
