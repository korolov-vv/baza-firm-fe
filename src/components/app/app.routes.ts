import { Routes } from '@angular/router';
import { MainPageComponent } from '../main-page/main-page.component';
import { AccountComponent } from '../account/account.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ListaFirmComponent } from '../lista-firm/lista-firm.component';
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
    path: 'lista-firm',
    canActivate: [AuthGuard],
    component: ListaFirmComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
