import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { RouteService } from "../route.service";
import { Route } from "../route.model";
import { MapLocation } from "../../map-location/map-location.model";
import { MapLocationService } from "../../map-location/map-location.service";
import { Location, NgForOf, NgIf } from "@angular/common";
import { maxPageSize } from "../../shared/http.config";

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
  route: Route;
  selectedFile: File = null;

  constructor(private routeService: RouteService,
              private mapLocationService: MapLocationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )

    if (this.editMode)   {
      this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.id)
        .subscribe(response => {
          this.mapLocations = response.content;
        })
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit()   {
    if (this.editMode) {
      this.routeService.patchRouteById(this.id, this.routeForm.value)
        .subscribe(() => {
          if (this.selectedFile) {
            this.routeService.uploadRouteImage(this.id, this.selectedFile)
              .subscribe(() => {
                this.goBack();
              });
          } else {
            this.goBack();
          }
        });
    } else {
      this.routeService.postRoute(this.routeForm.value)
        .subscribe(response => {
          if (this.selectedFile) {
            this.routeService.uploadRouteImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.goBack();
              });
          } else {
            this.goBack();
          }
        });
    }
  }

  goBack() {
    this.router.navigate(['../../', 'list', this.id], {relativeTo: this.activatedRoute});
  }

  onDelete() {
    if (confirm("You are about to delete " + this.route.name + " route. Dou you want to continue?")) {
      this.routeService.deleteRouteById(this.id)
        .subscribe(() => {
          this.router.navigate(['../../', 'list'], {relativeTo: this.activatedRoute});
        });
    }
  }

  onAddPoint() {
    this.router.navigate(['../../../point/new/' + this.id], {relativeTo: this.activatedRoute});
  }

  private initForm() {
    let routeName = '';
    let routeDescription = '';

    this.routeForm = new FormGroup({
      'name': new FormControl(routeName, Validators.required),
      'description': new FormControl(routeDescription, Validators.required),
    })

    if (this.editMode) {
      this.routeService.getRouteById(this.id)
        .subscribe(response => {
          this.route = response;

          routeName = this.route.name;
          routeDescription = this.route.description;
          if (this.route.user !== null) {
            this.userLogin = this.route.user.login;
          }

          this.routeForm.patchValue({
            'name': routeName,
            'description': routeDescription,
          })
        })
    }
  }
}
