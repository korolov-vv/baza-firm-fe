import { Routes } from '@angular/router';
import { MainPageComponent } from '../main-page/main-page.component';
import { AccountComponent } from '../account/account.component';
import { AuthGuard } from '../../core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    component: AccountComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
