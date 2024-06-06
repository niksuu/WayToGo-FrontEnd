import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LogInComponent} from "./user/log-in/log-in.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {RoutesComponent} from "./route/routes/routes.component";
import {UserRoutesComponent} from "./route/user-routes/user-routes.component";
import {RouteDetailComponent} from "./route/route-detail/route-detail.component";
import {RouteEditComponent} from "./route/route-edit/route-edit.component";
import {RouteInfoComponent} from "./route/route-info/route-info.component";
import {RouteListComponent} from "./route/route-list/route-list.component";
import {RegisterComponent} from "./user/register/register.component";
import {MapLocationEditComponent} from "./map-location/map-location-edit/map-location-edit.component";


const routes: Routes = [
  {
    path: 'log-in',
    component: LogInComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'point/new/:routeId',
    component: MapLocationEditComponent,
  },
  {
    path: 'routes/new',
    component: RouteEditComponent
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
        path: 'list',
        component: RouteListComponent,
        children: [
          {
            path:':id',
            component: RouteInfoComponent
          }
        ]
      },
      {
        path: ':id',
        component: RouteDetailComponent
      }
    ]
  },
  {
    path: 'routes/:id/edit',
    component: RouteEditComponent
  },
  {
    path: 'users/:id/routes',
    component: UserRoutesComponent,
  },
  {
    path: '',
    redirectTo: 'routes/list', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
