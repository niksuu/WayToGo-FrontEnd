import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {maxPageSize} from "../../shared/http.config";
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgIf} from "@angular/common";



@Component({
  selector: 'app-route-info',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './route-info.component.html',
  styleUrl: './route-info.component.css'
})
export class RouteInfoComponent  implements OnInit{

  routeId: string;
  route: Route;

  constructor(private activatedRoute: ActivatedRoute, private routeService: RouteService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe (
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;

        });
      }
    );

  }
}
