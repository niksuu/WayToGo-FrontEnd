import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";

@Component({
  selector: 'app-points-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './map-location-edit.component.html',
  styleUrl: './map-location-edit.component.css'
})
export class MapLocationEditComponent implements OnInit {
  routeId: string;
  mapLocationForm: FormGroup;
  mapLocation: MapLocation;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.routeId = params['routeId'];
        this.initForm();
      }
    )
  }

  onSubmit() {
    console.log("In Submit")
    console.log(this.mapLocationForm.value)
    this.goBack();
  }

  goBack() {
    console.log("In Back")
    this.router.navigate(['../../../routes/' + this.routeId + '/edit'], {relativeTo: this.activatedRoute});
  }

  private initForm() {
    let mapLocationName = '';
    let mapLocationDescription = '';

    this.mapLocationForm = new FormGroup({
      'name': new FormControl(mapLocationName, Validators.required),
      'description': new FormControl(mapLocationDescription, Validators.required),
    })
  }
}
