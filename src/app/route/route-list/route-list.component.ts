import {Component, Input, OnInit} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {defaultPageSize} from "../../shared/http.config";
import {FormsModule} from "@angular/forms";
import {RouteMapLocationService} from "../../route-map-location/route-map-location.service";
import {tadaAnimation} from "angular-animations";
import {ConfirmationDialogService} from "../../shared/confirmation-dialog/confirmation-dialog.service";
import {SnackbarType} from "../../shared/snackbar/snackbar-type";
import {SnackbarService} from "../../shared/snackbar/snackbar.service";
import {catchError, of} from "rxjs";
import {MapLocationConflictError} from "../../shared/errors/route-map-location-conflict.error";


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
export class RouteListComponent implements OnInit{
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
  protected isLoading: boolean;
  protected isError: boolean;

  constructor(private routeService: RouteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeMapLocationService: RouteMapLocationService,
              private confirmationDialogService: ConfirmationDialogService,
              private snackbarService: SnackbarService,) {
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
    this.isLoading = true; // Ustawienie flagi ładowania na true
    this.isError = false;  // Resetowanie błędu przed nową próbą pobrania danych

    this.validateQueryParams();

    if (this.userMode || this.addingPointToRoute) {
      this.routeService.getRouteByUserId(this.currentPageNumber, defaultPageSize, this.routeNameToSearch)
        .subscribe(
          response => {
            this.routes = response.content;
            this.totalPages = response.totalPages;
            if (this.currentPageNumber > this.totalPages) {
              this.currentPageNumber = this.totalPages;
              this.onPageChanged();
            }
            this.isLoading = false;
          },
          error => {
            this.isError = true;
            this.isLoading = false;
            console.error('Error fetching user routes:', error);
          }
        );
    } else {
      this.routeService.getRoutes(this.currentPageNumber, defaultPageSize, this.routeNameToSearch)
        .subscribe(
          response => {
            this.routes = response.content;
            this.totalPages = response.totalPages;
            if (this.currentPageNumber > this.totalPages) {
              this.currentPageNumber = this.totalPages;
              this.onPageChanged();
            }
            this.isLoading = false;
          },
          error => {
            this.isError = true;
            this.isLoading = false;
            console.error('Error fetching routes:', error);
          }
        );
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
    this.confirmationDialogService
      .confirm(
        'Confirm Addition',
        `You are about to add a point to the ${this.selectedRoute.name} route. Do you want to proceed?`,
        'Yes, add point',
        'Cancel'
      )
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.routeMapLocationService
            .postRouteMapLocation(this.selectedRoute.id, this.pointIdToBeAdded)
            .pipe(
              catchError((error) => {
                if (error instanceof MapLocationConflictError) {
                  this.snackbarService.displaySnackbar(error.message, SnackbarType.WARNING);
                } else {
                  this.snackbarService.displaySnackbar('An error occurred while adding the map location.', SnackbarType.DANGER);
                }
                return of(null);
              })
            )
            .subscribe((response) => {
              if (response) {
                this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
                this.snackbarService.displaySnackbar('Map location added', SnackbarType.SUCCESS);
              }
            });
        }
      });
  }
}
