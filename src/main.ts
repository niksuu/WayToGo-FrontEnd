import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {AppRoutingModule} from "./app/app-routing.module";
import {importProvidersFrom} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {jwtInterceptor} from "./app/interceptors/jwt.interceptor";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(AppRoutingModule, HttpClientModule),
    provideHttpClient(
      // registering interceptors
      withInterceptors([jwtInterceptor])
    ), provideAnimationsAsync()]
});
