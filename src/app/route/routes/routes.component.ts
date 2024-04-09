import {Component, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {RouteItemComponent} from "../route-item/route-item.component";
import {RouteListComponent} from "../route-list/route-list.component";



@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent, CommonModule, RouteItemComponent, RouteListComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {



}
