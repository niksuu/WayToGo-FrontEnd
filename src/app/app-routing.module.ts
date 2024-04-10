import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LogInComponent} from "./user/log-in/log-in.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {RoutesComponent} from "./route/routes/routes.component";
import {UserRoutesComponent} from "./route/user-routes/user-routes.component";
import {RouteDetailComponent} from "./route/route-detail/route-detail.component";


const routes: Routes = [
  {
    path: 'log-in',
    component: LogInComponent,
  },
  {
    path: 'users/:id',
    component: UserProfileComponent,
  },
  {
    path: 'routes',
    component: RoutesComponent,
    children: [
      {
        path: ':id',
        component: RouteDetailComponent,
      }
    ]
  },
  {
    path: 'users/:id/routes',
    component: UserRoutesComponent,
  },
  {
    path: '',
    redirectTo: 'routes', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
