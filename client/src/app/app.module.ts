import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Material Design & FlexLayout
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSidenavModule,
  MatSlideToggleModule,
  DateAdapter,
  MatChipsModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

// Restangular
import { UrlSettings } from './config/url.settings';
import { RestangularModule } from 'ngx-restangular';

// Routing
import { appRoutingProviders, routing } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Directives
import { CarouselItemDirective } from './directive/carousel-item.directive';

// Services
import { AuthenticationService } from './services/authentication.service';
import { ContributorService } from './services/contributor.service';
import { EventService } from './services/event.service';
import { LocationService } from './services/location.service';
import { UserService } from './services/user.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

// Resolvers
import { UserResolver } from './resolver/user.resolver';

// Components
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './components/admin/admin.component';
import { EventFormComponent } from './components/admin/event-form/event-form.component';
import { ContributorFormComponent } from './components/admin/contributor-form/contributor-form.component';
import { AddElementComponent } from './components/admin/add-element/add-element.component';
import { CarouselComponent, CarouselItemElement } from './components/carousel/carousel.component';

// Dialogs
import { DialogComponent } from './components/common/dialog/dialog.component';
import { PopupSigninComponent } from './components/home/popup-signin/popup-signin.component';
import { HomeFiltersComponent } from './components/home/home-filters/home-filters.component';
import { AdminFiltersComponent } from './components/admin/admin-filters/admin-filters.component';
import { SearchBarComponent } from './components/common/search-bar/search-bar.component';
import { EventComponent } from './components/event/event.component';
import { EventPlanningComponent } from './components/admin/event-planning/event-planning.component';
import { FrenchDateAdapter } from './util/FrenchDateAdapter';
import { EventLocationTypeComponent } from './components/admin/event-location-type/event-location-type.component';
import { EventContributorsComponent } from './components/admin/event-contributors/event-contributors.component';
import { ContributorServicesComponent } from './components/admin/contributor-services/contributor-services.component';
import { ContributorComponent } from './components/contributor/contributor.component';
import { ContributorEditionComponent } from './components/contributor-edition/contributor-edition.component';
import { EventEditionComponent } from './components/event-edition/event-edition.component';
import { EventMissingComponent } from './components/admin/event-missing/event-missing.component';
import { RepresentedOnMapComponent } from './components/base/represented-on-map/represented-on-map.component';
import { WeekDaySelectorComponent } from './common/week-day-selector/week-day-selector.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { UserFormComponent } from './components/admin/user-form/user-form.component';
import { FormErrorComponent } from './components/common/form-error/form-error.component';

registerLocaleData(localeFr);

/**
 * Function for settting the default restangular configuration
 */
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl(UrlSettings.API_ENDPOINT);
  RestangularProvider.setPlainByDefault(true);
  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    return {
      params: assignWithoutUndefinedValues({}, params),
      headers,
      element
    }
  });

  function assignWithoutUndefinedValues(target, source) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        target[key] = val;
      }
    }
    return target;
  }

  // Authentication token if exists
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const accessTokenId = JSON.parse(accessToken).id;
    if (!accessTokenId) {
      throw new Error('Error with access token ID');
    }
    RestangularProvider.setDefaultHeaders({ 'Authorization': accessTokenId });
  }
}

/**
 * Function to compute if we are logged in before loading the appModule
 */
export function startupServiceFactory(authenticationService: AuthenticationService): Function {
  return () => authenticationService.computeIsLoggedIn();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PopupSigninComponent,
    DialogComponent,
    AdminComponent,
    EventFormComponent,
    ContributorFormComponent,
    AddElementComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElement,
    HomeFiltersComponent,
    AdminFiltersComponent,
    SearchBarComponent,
    EventComponent,
    EventPlanningComponent,
    EventLocationTypeComponent,
    ContributorServicesComponent,
    ContributorComponent,
    EventContributorsComponent,
    ContributorEditionComponent,
    EventEditionComponent,
    EventMissingComponent,
    WeekDaySelectorComponent,
    UsersListComponent,
    UserFormComponent,
    FormErrorComponent
  ],
  entryComponents: [
    PopupSigninComponent,
    DialogComponent,
    AddElementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatChipsModule,
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory),
    routing
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthenticationService],
      multi: true
    },
    {
      provide: DateAdapter,
      useClass: FrenchDateAdapter
    },
    appRoutingProviders,
    AuthenticationService,
    EventService,
    LocationService,
    ContributorService,
    UserService,
    AuthGuard,
    UnauthGuard,
    UserResolver,
    { provide: LOCALE_ID, useValue: 'fr' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
MatButtonToggleModule,
MatCardModule,
MatChipsModule,
MatGridListModule,
MatListModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRippleModule,
MatSliderModule,
MatSnackBarModule,
MatSortModule,
MatTableModule,
MatTabsModule,
MatToolbarModule,
MatTooltipModule,
MatStepperModule
*/