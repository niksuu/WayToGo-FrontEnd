import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";

@Component({
  selector: 'app-route-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './route-edit.component.html',
  styleUrl: './route-edit.component.css'
})
export class RouteEditComponent implements OnInit {
  id: string;
  routeForm: FormGroup;
  userLogin: string;
  mapLocations: MapLocation[];


  constructor(private routeService: RouteService,
              private mapLocationService: MapLocationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.initForm();
      }
    )

  }

  onSubmit() {
    console.log(this.routeForm.value);
    this.routeService.patchRouteById(this.id, this.routeForm.value)
      .subscribe(
        response => {
          console.log(response);
        }
      );

    this.onCancel();
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

    let route: Route = null;
    this.routeService.getRouteById(this.id)
      .subscribe(response => {
        console.log(response);
        route = response;
        routeName = route.name;
        routeDescription = route.description;
        this.userLogin = route.user.login;

        this.routeForm.patchValue({
          'name': routeName,
          'description': routeDescription,
        })
      });
  }
}
