import {Component, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";

import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";



@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {
  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  onAddNewRoute(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}
