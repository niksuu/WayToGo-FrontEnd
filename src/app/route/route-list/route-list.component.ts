import {Component, Input} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";
import {defaultPageSize} from "../../shared/http.config";
import {FormsModule} from "@angular/forms";
import {RouteMapLocationService} from "../../route-map-location/route-map-location.service";
import {tadaAnimation} from "angular-animations";


@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    FormsModule,
    NgIf
  ],
  animations: [
    tadaAnimation()
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent {
  routes: Route[] = [];
  currentPageNumber: number;
  totalPages: number;
  routeNameToSearch: string;
  public userMode: boolean;
  user = null;
  selectedRoute: Route;
  animationState: boolean = true;

  @Input() addingPointToRoute: boolean = false;
  @Input() pointIdToBeAdded: string;

  constructor(private routeService: RouteService, private mapLocationService: MapLocationService,
              private mapService: MapService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeMapLocationService: RouteMapLocationService) {
  }

  ngOnInit() {
    this.selectedRoute = null;
    this.activatedRoute.queryParams.subscribe(params => {




      this.currentPageNumber = params['page'] ? +params['page'] : 1;
      this.routeNameToSearch = params['routeName'] ? params['routeName'] : null;

      this.routeService.isUserMode(this.activatedRoute, this.router).subscribe(userMode => {
        this.userMode = userMode;
        this.getRoutes();
      });




    });

  }

  onAddNewRoute() {
    this.router.navigate(['../', 'new'], {relativeTo: this.activatedRoute})
  }

  onPrevPage() {
    if (this.currentPageNumber > 1) {
      this.currentPageNumber--;
      this.getRoutes();
      this.onPageChanged();
    }
  }

  onNextPage() {
    if (this.currentPageNumber < this.totalPages) {
      this.currentPageNumber++;
      this.getRoutes();
      this.onPageChanged();
    }
  }

  onPageChanged() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {page: this.currentPageNumber},
        queryParamsHandling: 'merge',
      }
    );
  }

  onGetRoutesByName() {
    this.currentPageNumber = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {page: this.currentPageNumber, routeName: this.routeNameToSearch},
        queryParamsHandling: 'merge',
      }
    );
    this.getRoutes()
  }

  onClearFilters() {
    this.routeNameToSearch = "";
    this.currentPageNumber = 1;
    this.getRoutes();
    this.onPageChanged()
  }

  showCurrentPageNumber() {
    let pageNumberString = '';
    if (this.currentPageNumber > 2) {
      pageNumberString += '... ';
    }
    if (this.currentPageNumber > 1) {
      pageNumberString += (this.currentPageNumber - 1) + ' ';
    }
    //pageNumberString += this.currentPageNumber;
    pageNumberString += `<span><strong>${this.currentPageNumber}</strong></span>`;
    if (this.currentPageNumber <= this.totalPages - 1) {
      pageNumberString += ' ' + (this.currentPageNumber + 1) + ' ';
    }
    if (this.currentPageNumber <= this.totalPages - 2) {
      pageNumberString += '... ';
    }
    return pageNumberString;
  }

  getRoutes() {
    this.validateQueryParams();
    if (this.userMode || this.addingPointToRoute) {
      this.routeService.getRouteByUserId(this.currentPageNumber, defaultPageSize, this.routeNameToSearch).subscribe(response => {
        this.routes = response.content;
        this.totalPages = response.totalPages;
        if (this.currentPageNumber > this.totalPages) {
          this.currentPageNumber = this.totalPages;
          this.onPageChanged();
        }
      });
    } else {
      this.routeService.getRoutes(this.currentPageNumber, defaultPageSize, this.routeNameToSearch).subscribe(response => {
        this.routes = response.content;
        this.totalPages = response.totalPages;
        if (this.currentPageNumber > this.totalPages) {
          this.currentPageNumber = this.totalPages;
          this.onPageChanged();

        }
      });
    }

  }

  validateQueryParams() {
    if (!this.routeNameToSearch || this.routeNameToSearch === "") {
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {routeName: null},
          queryParamsHandling: 'merge',
        }
      );

    }
  }

  onRouteSelected(route: Route) {

    //animate icon
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 1);

    //double click lets you see the detials
    if(route == this.selectedRoute && !this.addingPointToRoute) {
      this.selectedRoute = null;
      this.navigateToRoute(route);

    }
    else {
      this.selectedRoute = route;
    }

    if (this.addingPointToRoute) {
      this.addPointToRoute()
    }


  }

  navigateToRoute(route:Route) {
    if (this.userMode) {
      this.router.navigate(['/yourRoutes/', route.id]);
    } else {
      this.router.navigate(['/routes/', route.id]);
    }
  }

  addPointToRoute() {
    if (confirm("You are about to add point to " + this.selectedRoute.name + " route.")) {
      this.routeMapLocationService.postRouteMapLocation(this.selectedRoute.id, this.pointIdToBeAdded)
        .subscribe( response => {
          this.router.navigate(['../list'], {relativeTo: this.activatedRoute})
        });
    }
  }
}
