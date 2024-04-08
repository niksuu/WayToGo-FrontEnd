import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {AppRoutingModule} from "./app/app-routing.module";
import {importProvidersFrom} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";


bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(AppRoutingModule, HttpClientModule)]
});
