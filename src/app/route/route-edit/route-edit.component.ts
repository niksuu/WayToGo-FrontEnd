import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RouteService } from "../route.service";
import { Route } from "../route.model";
import { MapLocation } from "../../map-location/map-location.model";
import { MapLocationService } from "../../map-location/map-location.service";
import { Location, NgForOf, NgIf } from "@angular/common";
import { maxPageSize } from "../../shared/http.config";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MapLocationListComponent} from "../../map-location/map-location-list/map-location-list.component";
import {CanComponentDeactivate} from "../../shared/guards/can-deactivate-guard.service";
import {CanDeactivateFormGuardService} from "../../shared/guards/can-deactivate-form-guard.service";
import {catchError, of} from "rxjs";
import {MapLocationConflictError} from "../../shared/errors/route-map-location-conflict.error";
import {SnackbarType} from "../../shared/snackbar/snackbar-type";
import {ConfirmationDialogService} from "../../shared/confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: 'app-route-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MapLocationListComponent
  ],
  templateUrl: './route-edit.component.html',
  styleUrl: './route-edit.component.css'
})
export class RouteEditComponent implements OnInit, CanComponentDeactivate {
  id: string;
  routeForm: FormGroup;
  userLogin: string;
  mapLocations: MapLocation[];
  editMode: boolean = false;
  route: Route;
  selectedFile: File = null;
  currentImageUrl: SafeUrl = null;
  imagePreview: string | ArrayBuffer | null = null;
  private submittingChangesInProcess: boolean = false;

  constructor(private routeService: RouteService,
              private mapLocationService: MapLocationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private canDeactivateFormGuardService: CanDeactivateFormGuardService,
              private confirmationDialogService: ConfirmationDialogService,) {
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(urlSegments => {
      this.editMode = !urlSegments.some(segment => segment.path === 'new');
      this.id = this.editMode ? this.activatedRoute.snapshot.params['id'] : null;
      this.initForm();
    });

    if (this.editMode) {
      this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.id)
        .subscribe(response => {
          this.mapLocations = response.content;
        })
    }
  }

  canDeactivate(): Promise<boolean> {
    if(this.submittingChangesInProcess) {
      return Promise.resolve(true);
    }
    return this.canDeactivateFormGuardService.canDeactivateForm(this.routeForm.dirty && !this.routeForm.pristine);
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      this.routeForm.markAsDirty();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    this.submittingChangesInProcess = true;
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
          this.id = response.id;
          if (this.selectedFile) {
            this.routeService.uploadRouteImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.goBack();
              });
          } else {
            this.router.navigate(['yourRoutes', 'list']);
          }
        });
    }
  }

  goBack() {
    if (this.editMode) {
      this.router.navigate(['../../../yourRoutes/' + this.id], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
    }
  }

  onDelete() {
    this.submittingChangesInProcess = true;

    this.confirmationDialogService
      .confirm(
        'Confirm Deletion',
        `You are about to delete your route. Do you want to proceed?`,
        'Yes',
        'Cancel'
      )
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.routeService.deleteRouteById(this.id)
            .subscribe(() => {
              this.router.navigate(['../../', 'list'], { relativeTo: this.activatedRoute });
            });
        }
      });
  }




  onAddPoint() {
    this.router.navigate(['../../../point/new/' + this.id], { relativeTo: this.activatedRoute });
  }

  private initForm() {
    let routeName = '';
    let routeDescription = '';

    this.routeForm = new FormGroup({
      'name': new FormControl(routeName, Validators.required),
      'description': new FormControl(routeDescription, Validators.required),
    });

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
          });

          this.routeService.getRouteImageById(this.id).subscribe({
            next: (response: Blob | null) => {
              if (response) {
                const objectURL = URL.createObjectURL(response);
                this.currentImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
            },
            error: (error: any) => {
              console.error('Error fetching current image:', error);
              this.currentImageUrl = null;
            }
          });
        });
    }
  }
}
