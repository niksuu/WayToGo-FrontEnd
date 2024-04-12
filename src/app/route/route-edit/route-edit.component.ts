import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";
import {NgForOf, NgIf} from "@angular/common";
import {maxPageSize} from "../../shared/http.config";

@Component({
  selector: 'app-route-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './route-edit.component.html',
  styleUrl: './route-edit.component.css'
})
export class RouteEditComponent implements OnInit {
  id: string;
  routeForm: FormGroup;
  userLogin: string;
  mapLocations: MapLocation[];
  editMode: boolean = false;


  constructor(private routeService: RouteService,
              private mapLocationService: MapLocationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        console.log(this.editMode);
        this.initForm();
      }
    )
    if (this.editMode) {
      this.mapLocationService.getMapLocationsByRoute(0, maxPageSize,
        new Route(
          this.id,
          '',
          '',
          null
        )
      ).subscribe(
        response => {
          this.mapLocations = response.content;
        }
      )
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.routeService.patchRouteById(this.id, this.routeForm.value)
        .subscribe(() => {
          this.onCancel();
        });
    } else {
      this.routeService.postRoute(this.routeForm.value)
        .subscribe(() => {
          this.onCancel();
        });
    }
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {
    let routeName = '';
    let routeDescription = '';

    this.routeForm = new FormGroup({
      'name': new FormControl(routeName, Validators.required),
      'description': new FormControl(routeDescription, Validators.required),
    })

    if (this.editMode) {
      let route: Route = null;
      this.routeService.getRouteById(this.id)
        .subscribe(response => {
          route = response;
          routeName = route.name;
          routeDescription = route.description;
          if(route.user !== null) {
            this.userLogin = route.user.login;
          }

          this.routeForm.patchValue({
            'name': routeName,
            'description': routeDescription,
          })
        });
    }
  }
}
