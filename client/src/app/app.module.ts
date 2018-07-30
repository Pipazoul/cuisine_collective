import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';

// Material Design & FlexLayout
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSidenavModule
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
    CarouselItemElement
  ],
  entryComponents: [
    PopupSigninComponent,
    DialogComponent,
    AddElementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
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
    appRoutingProviders,
    AuthenticationService,
    UserService,
    ComponentInjectorService,
    AuthGuard,
    UnauthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
MatAutocompleteModule,
MatButtonToggleModule,
MatCardModule,
MatCheckboxModule,
MatChipsModule,
MatDatepickerModule,
MatExpansionModule,
MatGridListModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
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