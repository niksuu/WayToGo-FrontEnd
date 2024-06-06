import {Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit {

  toggleSidePanel = true;
  panelButtonContent: string = "";

  //DONT DELETE THIS!!!!!!!!!!!!!!!!
  //for hiding the side panel after clicking the map
  /*@HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as Element;
    if (!!targetElement.closest('.map-wrapper') && !targetElement.closest('.panel-button')) {
      this.toggleSidePanel = false;

    }
  }*/

  constructor() {

  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";
  }

  ngOnInit(): void {
    this.toggleSidePanel = true;
  }
}
