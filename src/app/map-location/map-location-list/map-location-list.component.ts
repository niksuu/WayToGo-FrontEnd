import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MapLocationService} from "../map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {Route} from "../../route/route.model";
import {MapLocation} from "../map-location.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "../../route/route-list/route-item/route-item.component";
import {ActivatedRoute, Router, RouterLinkActive} from "@angular/router";
import {SidePanelService} from "../../shared/side-panel.service";
import {MapService} from "../../shared/map/map.service";
import {AudioService} from "../../audio/audio.service";
import {Audio} from "../../audio/audio.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ScreenSizeService} from "../../shared/screen-size.service";
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {bounceInDownAnimation, headShakeAnimation} from "angular-animations";
import {RouteService} from "../../route/route.service";
import {RouteListComponent} from "../../route/route-list/route-list.component";

@Component({
  selector: 'app-map-location-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass,
    NgIf,
    RouteListComponent,

  ],
  animations: [
    headShakeAnimation()
  ],
  templateUrl: './map-location-list.component.html',
  styleUrl: './map-location-list.component.css'
})
export class MapLocationListComponent implements OnInit, OnChanges {

  @Input() route: Route;
  mapLocations: MapLocation[];
  activeMapLocationId: string;

  mobileVersion: boolean;

  @ViewChild('info') infoWrapper: ElementRef;
  infoWrapperAnimationState: boolean;

  userMode = false;

  addingPointToRoute = false;
  pointIdToBeAdded: string;

  constructor(private mapService: MapService,
              private sidePanelService: SidePanelService,
              private mapLocationService: MapLocationService,
              private screenSizeService: ScreenSizeService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeService: RouteService) { }



  ngOnInit(): void {
    this.routeService.isUserMode(this.activatedRoute, this.router).subscribe(response => {
      this.userMode = response;
    })

    this.infoWrapperAnimationState = false;
    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    //subscribe to event emitted by map location in map info window
    this.mapService.mapLocationDetailsEventEmitter.subscribe(mapLocation => {
      this.onMapLocationSelected(mapLocation);
      this.activeMapLocationId = mapLocation.id;
      this.sidePanelService.togglePanelEventEmitter.emit(true);

    });

    if (this.route) {
      this.fetchMapLocations();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['route'] && changes['route'].currentValue) {
      this.fetchMapLocations();
    }
  }

  onMapLocationSelected(mapLocation: MapLocation) {


    this.mapService.centerOnMapLocation.emit(mapLocation);
    if(this.activeMapLocationId == mapLocation.id) {
      this.activeMapLocationId = null;
    }
    else {
      this.activeMapLocationId = mapLocation.id;
      if (this.mobileVersion) {
        this.sidePanelService.togglePanelEventEmitter.emit(false);
      }
    }

  }

  private fetchMapLocations() {
    this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
      .subscribe(response => {
        this.mapLocations = response.content;
        this.mapService.routeSelectedEventEmitter.emit(this.mapLocations);
      });
  }

  onMapLocationEdit(mapLocationId: string) {
    this.router.navigate(['point/' + mapLocationId + '/edit'])
  }

  onMapLocationDelete(mapLocationId: string) {
    if (confirm("You are about to delete map location. Do you want to continue?")) {
      this.mapLocationService.deleteMapLocationFromRoute(mapLocationId, this.route.id).subscribe( () => {
        this.fetchMapLocations();
      });
    }
  }

  onAddToYourRoute(mapLocationId: string) {
    this.pointIdToBeAdded = mapLocationId;
    this.addingPointToRoute = !this.addingPointToRoute;
  }
}
