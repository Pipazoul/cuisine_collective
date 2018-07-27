import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

// Restangular
import { UrlSettings } from './config/url.settings';
import { RestangularModule, Restangular } from 'ngx-restangular';



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

// Design
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
MatAutocompleteModule,
MatButtonModule,
MatButtonToggleModule,
MatCardModule,
MatCheckboxModule,
MatChipsModule,
MatDatepickerModule,
MatDialogModule,
MatExpansionModule,
MatGridListModule,
MatIconModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatRippleModule,
MatSidenavModule,
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