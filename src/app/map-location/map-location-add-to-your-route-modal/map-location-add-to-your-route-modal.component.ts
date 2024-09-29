import {Component, Input, OnInit} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
import {RouteListComponent} from "../../route/route-list/route-list.component";

@Component({
  selector: 'app-map-location-add-to-your-route-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouteListComponent
  ],
  animations: [],
  templateUrl: './map-location-add-to-your-route-modal.component.html',
  styleUrl: './map-location-add-to-your-route-modal.component.css'
})
export class MapLocationAddToYourRouteModalComponent implements OnInit {
  @Input() mapLocation: MapLocation;

  ngOnInit(): void {
  }


}
