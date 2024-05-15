import {Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule, NgIf} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {ActivatedRoute, Params, Router, RouterOutlet} from "@angular/router";
import {SidePanelComponent} from "../../shared/side-panel/side-panel.component";




@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [  MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet, SidePanelComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {





  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  onAddNewRoute(){
    this.router.navigate(['new'], {relativeTo: this.activatedRoute})
  }




}
