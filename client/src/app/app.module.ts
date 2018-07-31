import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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
  MatNativeDateModule,
  MatRadioModule,
  MatSidenavModule,
  MatSlideToggleModule,
  DateAdapter
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
import { ComponentInjectorService } from './services/component-injector.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

// Components
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './components/admin/admin.component';
import { EventFormComponent } from './components/admin/event-form/event-form.component';
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
    AddElementComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElement,
    HomeFiltersComponent,
    AdminFiltersComponent,
    SearchBarComponent,
    EventComponent,
    EventPlanningComponent,
    EventLocationTypeComponent
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
    MatNativeDateModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
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
    UserService,
    ComponentInjectorService,
    AuthGuard,
    UnauthGuard
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
MatMenuModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRippleModule,
MatSliderModule,
MatSlideToggleModule,
MatSnackBarModule,
MatSortModule,
MatTableModule,
MatTabsModule,
MatToolbarModule,
MatTooltipModule,
MatSelectModule,
MatStepperModule
*/