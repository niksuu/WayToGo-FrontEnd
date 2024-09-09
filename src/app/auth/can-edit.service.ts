import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {UserService} from "../user/user.service";
import {RouteService} from "../route/route.service";
import {Route} from "../route/route.model";

@Injectable({
  providedIn: 'root'
})
export class CanEditService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private routeService: RouteService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const tokenUserId = this.authService.getUserId();

    let routeId: string | null = null;
    if (route.paramMap.has('id')) {
      routeId = route.paramMap.get('id');
      this.routeService.getRouteById(routeId).subscribe(
        (route) => {
          if (tokenUserId === route.user.id) {
          } else {
            this.router.navigate(['/']);
          }
        },
      )
    }
    return true
  }
}
