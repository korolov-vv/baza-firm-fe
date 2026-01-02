import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './components/app/app.config';
import { AppComponent } from './components/app/app.component';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
