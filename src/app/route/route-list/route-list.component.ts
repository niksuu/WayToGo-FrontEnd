import {Component, Input} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {RouteItemComponent} from "../route-item/route-item.component";

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent {
  routes: Route[] = [];
  constructor(private routeService : RouteService, private http: HttpClient) {}
  ngOnInit() {
    this.routeService.getRoutes(1, 10).subscribe(response => {
      this.routes = response.content;
    });

  }
}
