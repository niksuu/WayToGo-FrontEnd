import {Component} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";
import {defaultPageSize} from "../../shared/http.config";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    FormsModule
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

  constructor(private routeService: RouteService, private mapLocationService: MapLocationService,
              private mapService: MapService, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
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
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {routeName: this.routeNameToSearch},
        queryParamsHandling: 'merge',
      }
    );
    this.getRoutes()
  }

  onClearFilters() {
    this.routeNameToSearch = "";
    this.getRoutes();
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
    if (this.userMode) {
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
}
