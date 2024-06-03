import {Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule, NgIf} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {ActivatedRoute, Params, Router, RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [  MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit {

  toggleSidePanel = true;
  panelButtonContent: string = "";

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as Element;
    if (!!targetElement.closest('.map-wrapper') && !targetElement.closest('.panel-button')) {
      this.toggleSidePanel = false;

    }
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  onAddNewRoute(){
    this.router.navigate(['new'], {relativeTo: this.activatedRoute})
  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";
  }

  ngOnInit(): void {
    this.toggleSidePanel = true;
  }
}
