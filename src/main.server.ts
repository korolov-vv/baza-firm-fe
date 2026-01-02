import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { config } from './components/app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);

export default bootstrap;
