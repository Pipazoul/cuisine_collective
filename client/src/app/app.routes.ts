import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

// Components
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeFiltersComponent } from './components/home/home-filters/home-filters.component';
import { EventComponent } from './components/event/event.component';

const ROUTES: Routes = [{
  path: 'home',
  canActivate: [UnauthGuard],
  children: [
    {
      path: '',
      component: HomeComponent,
      outlet: "primary"
    }, {
      path: '',
      component: HomeFiltersComponent,
      outlet: "sidenav"
    }
  ]
}, {
  path: 'events/:id',
  canActivate: [UnauthGuard],
  children: [
    {
      path: '',
      component: EventComponent,
      outlet: "primary"
    }, {
      path: '',
      component: HomeFiltersComponent,
      outlet: "sidenav"
    }
  ]
}, {
  path: 'admin',
  component: AdminComponent,
  canActivate: [AuthGuard]
}, {
  path: '**',
  redirectTo: 'home'
}];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' });
