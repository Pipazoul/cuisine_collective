import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

// Components
import { AdminComponent } from './components/admin/admin.component';
import { HomeFiltersComponent } from './components/home/home-filters/home-filters.component';
import { AdminFiltersComponent } from './components/admin/admin-filters/admin-filters.component';
import { EventComponent } from './components/event/event.component';
import { AddElementComponent } from './components/admin/add-element/add-element.component';
import { ContributorComponent } from './components/contributor/contributor.component';
import { EventEditionComponent } from './components/event-edition/event-edition.component';
import { ContributorEditionComponent } from './components/contributor-edition/contributor-edition.component';

const ROUTES: Routes = [{
  path: '',
  canActivate: [UnauthGuard],
  children: [
    {
      path: '',
      component: HomeFiltersComponent,
      outlet: "sidenav"
    }, {
      path: 'events/:id',
      canActivate: [UnauthGuard],
      component: EventComponent
    }, {
      path: 'contributors/:id',
      canActivate: [UnauthGuard],
      component: ContributorComponent
    }
  ]
}, {
  path: 'admin',
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      component: AdminFiltersComponent,
      outlet: "sidenav"
    }, {
      path: '',
      component: AdminComponent,
      outlet: "mapOverlay"
    }, {
      path: 'addElement',
      component: AddElementComponent,
    }, {
      path: 'events/:id',
      component: EventComponent,
    }, {
      path: 'events/:id/edit',
      component: EventEditionComponent,
    },
    {
      path: 'events',
      component: EventEditionComponent
    },
    {
      path: 'contributors/:id',
      component: ContributorComponent
    }, {
      path: 'contributors/:id/edit',
      component: ContributorEditionComponent,
    },
    {
      path: 'contributors',
      component: ContributorEditionComponent
    }
  ]
}, {
  path: '**',
  redirectTo: ''
}];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' });
