import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authCodeFlowConfig: AuthConfig = {
  issuer: `${environment.keycloak.url}/realms/${environment.keycloak.realm}`,
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  clientId: environment.keycloak.clientId,
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: !environment.production,
  requireHttps: false,
  strictDiscoveryDocumentValidation: false
};
