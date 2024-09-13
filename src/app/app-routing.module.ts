import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogInComponent} from "./user/log-in/log-in.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {RoutesComponent} from "./route/routes/routes.component";
import {RouteDetailComponent} from "./route/route-detail/route-detail.component";
import {RouteEditComponent} from "./route/route-edit/route-edit.component";
import {RouteInfoComponent} from "./route/route-info/route-info.component";
import {RouteListComponent} from "./route/route-list/route-list.component";
import {RegisterComponent} from "./user/register/register.component";
import {MapLocationEditComponent} from "./map-location/map-location-edit/map-location-edit.component";
import {AuthGuardService} from "./auth/auth-guard.service";
import {CanEditService} from "./auth/can-edit.service";




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
    canActivate: [AuthGuardService],
    component: MapLocationEditComponent,
  },
  {
    path: 'point/:pointId/edit',
    canActivate: [AuthGuardService],
    component: MapLocationEditComponent,
  },
  {
    path: 'routes/new',
    canActivate: [AuthGuardService],
    component: RouteEditComponent
  },
  {
    path: 'yourRoutes/new',
    canActivate: [AuthGuardService],
    component: RouteEditComponent
  },
  {
    path: 'users/:id',
    canActivate: [AuthGuardService],
    component: UserProfileComponent,
  },
  {
    path: 'routes',
    canActivate: [AuthGuardService],
    component: RoutesComponent,
    children: [
      {
        path: 'list',
        component: RouteListComponent,
        children: [
          {
            path: ':id',
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
  // {
  //   path: 'users/:id/routes',
  //   canActivate: [AuthGuardService],
  //   component: UserRoutesComponent,
  // },
  {
    path: 'yourRoutes',
    canActivate: [AuthGuardService],
    component: RoutesComponent,
    children: [
      {
        path: 'list',
        component: RouteListComponent,
        children: [
          {
            path: ':id',
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
    path: 'yourRoutes/:id/edit',
    canActivate: [AuthGuardService,CanEditService],
    component: RouteEditComponent
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
export class AppRoutingModule {
}
