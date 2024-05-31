import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
//import {MapComponent} from "../../shared/map/map.component";
import {MapComponent} from "../map/map.component";
import {MapService} from "../map/map.service";

@Component({
  selector: 'app-points-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MapComponent,
    MapComponent
  ],
  templateUrl: './map-location-edit.component.html',
  styleUrl: './map-location-edit.component.css'
})
export class MapLocationEditComponent implements OnInit {
  routeId: string;
  mapLocationForm: FormGroup;
  lat: number | undefined;
  lng: number | undefined;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private mapService: MapService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.routeId = params['routeId'];
        this.initForm();
      }
    )

    this.mapService.markerSelectedEmitter.subscribe((position: { lat: number, lng: number }) => {
      this.mapLocationForm.patchValue({
        lat: position.lat,
        lng: position.lng
      });
      console.log('Nowa pozycja markera - Lat:', this.lat, 'Lng:', this.lng);
    })
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
      'description': new FormControl(mapLocationDescription),
      'lat': new FormControl(null, Validators.required),
      'lng': new FormControl(null, Validators.required),
    })
  }
}
