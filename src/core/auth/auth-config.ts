import { AuthConfig } from 'angular-oauth2-oidc';
import { RuntimeConfigService } from '../services/runtime-config.service';
import { inject } from '@angular/core';

export function getAuthConfig(): AuthConfig {
  const configService = inject(RuntimeConfigService);
  const config = configService.getConfig();
  
  return {
    issuer: `${config.keycloak.url}/realms/${config.keycloak.realm}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    clientId: config.keycloak.clientId,
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: false,
    requireHttps: false,
    strictDiscoveryDocumentValidation: false
  };
}

// Keep for backwards compatibility, but config should be loaded dynamically
export const authCodeFlowConfig: AuthConfig = {
  issuer: '',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  clientId: '',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
  requireHttps: false,
  strictDiscoveryDocumentValidation: false
};
