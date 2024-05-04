import {Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule, NgIf} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {ActivatedRoute, Params, Router, RouterOutlet} from "@angular/router";
import {SidePanelComponent} from "../../shared/side-panel/side-panel.component";
import {RouteDetailService} from "../route-detail/route-detail.service";



@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [  MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet, SidePanelComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {



  toggleRouteDetails: boolean;



  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeDetailService: RouteDetailService) {



    this.toggleRouteDetails = false;

    this.routeDetailService.showRouteDetails.subscribe((ifShowDetails: boolean) => {
      this.toggleRouteDetails = ifShowDetails;
    });
  }

  onAddNewRoute(){
    this.router.navigate(['new'], {relativeTo: this.activatedRoute})
  }




}
