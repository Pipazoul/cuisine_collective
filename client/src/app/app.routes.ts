import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';

const ROUTES: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'admin',
  component: AdminComponent
}, {
  path: '**',
  redirectTo: 'home'
}];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' });
