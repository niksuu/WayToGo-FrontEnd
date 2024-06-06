import {Component} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";
import {defaultPageSize} from "../../shared/http.config";


@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent {
  routes: Route[] = [];
  currentPageNumber: number;
  totalPages: number;

  constructor(private routeService: RouteService, private mapLocationService: MapLocationService,
              private mapService: MapService, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentPageNumber = params['page'] ? +params['page'] : 1;
      this.getRoutes();
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
        queryParams: { page: this.currentPageNumber },
        queryParamsHandling: 'merge', // Dodaje lub aktualizuje parametr w bieżącej ścieżce
      }
    );
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
    pageNumberString += `<span class="text-primary"><strong>${this.currentPageNumber}</strong></span>`;
    if (this.currentPageNumber <= this.totalPages - 1) {
      pageNumberString += ' ' + (this.currentPageNumber + 1) + ' ';
    }
    if (this.currentPageNumber <= this.totalPages - 2) {
      pageNumberString += '... ';
    }
    return pageNumberString;
  }

  getRoutes() {
    this.routeService.getRoutes(this.currentPageNumber, defaultPageSize).subscribe(response => {
      this.routes = response.content;
      this.totalPages = response.totalPages;
      if (this.currentPageNumber > this.totalPages) {
        this.currentPageNumber = this.totalPages;
        this.onPageChanged();
      }
    });
  }
}
