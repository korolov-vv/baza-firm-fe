import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../core/auth/auth-config';


@NgModule({
declarations: [],
imports: [
AppComponent,
BrowserModule,
AppRoutingModule,
OAuthModule.forRoot({
resourceServer: {
allowedUrls: ["http://localhost:8080/api"],
sendAccessToken: true
}
})
],
providers: [],
bootstrap: []
})
export class AppModule {
constructor(private oauthService: OAuthService) {
this.configureOAuth();
}


private configureOAuth() {
this.oauthService.configure(authCodeFlowConfig);
// discovery + try login
this.oauthService.loadDiscoveryDocumentAndTryLogin();


// optional: automatic token refresh using refresh token rotation (depends on Keycloak config)
this.oauthService.setupAutomaticSilentRefresh();
}
}