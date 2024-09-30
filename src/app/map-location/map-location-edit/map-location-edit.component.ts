import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
import {PointSelectMapComponent} from "../point-select-map/point-select-map.component";
import {PointSelectMapService} from "../point-select-map/point-select-map.service";
import {MapLocationService} from "../map-location.service";
import {RouteMapLocationService} from "../../route-map-location/route-map-location.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Audio} from "../../audio/audio.model";
import {AudioService} from "../../audio/audio.service";
import {maxPageSize} from "../../shared/http.config";
import {CanComponentDeactivate} from "../../shared/guards/can-deactivate-guard.service";
import {CanDeactivateFormGuardService} from "../../shared/guards/can-deactivate-form-guard.service";
import {ConfirmationDialogService} from "../../shared/confirmation-dialog/confirmation-dialog.service";


@Component({
  selector: 'app-points-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    PointSelectMapComponent,
  ],
  templateUrl: './map-location-edit.component.html',
  styleUrl: './map-location-edit.component.css'
})
export class MapLocationEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('audioFileInput') audioFileInput: ElementRef;
  routeId: string;
  mapLocationId: string;
  mapLocationForm: FormGroup;
  audioForm: FormGroup;
  lat: number | undefined;
  lng: number | undefined;
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer | null = null;
  editMode = false;
  mapLocation: MapLocation;
  currentImageUrl: SafeUrl = null;
  audiosEntities: Audio[] = [];
  audioData: { audio: Audio, url: SafeUrl }[] = [];
  selectedAudioFile: File | null = null;
  temporaryAudioData: { audio: Audio, url: SafeUrl,file: File }[] = [];
  returnUrl: string | null = null;
  private submittingChangesInProcess: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private mapService: PointSelectMapService,
              private mapLocationService: MapLocationService,
              private routeMapLocationService: RouteMapLocationService,
              private audioService: AudioService,
              private sanitizer: DomSanitizer,
              private canDeactivateFormGuardService: CanDeactivateFormGuardService,
              private confirmationDialogService: ConfirmationDialogService,) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(urlSegments => {
      this.editMode = urlSegments.some(segment => segment.path === 'edit');
    });


    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });

    if (!this.editMode) {
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.routeId = params['routeId'];
          this.initForm();
          this.initForm2();
        }
      )
    } else {
      this.activatedRoute.queryParams.subscribe(params => {
        this.routeId = params['routeId'];
      });
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.mapLocationId = params['pointId'];
          this.initForm();
          this.initForm2();
        }
      )
    }

    this.fetchMapLocationAudio();

    this.mapService.markerSelectedEmitter.subscribe((position: { lat: number, lng: number }) => {
      this.mapLocationForm.patchValue({
        lat: position.lat,
        lng: position.lng
      });
    })

  }

  canDeactivate(): Promise<boolean> {
    if(this.submittingChangesInProcess) {
      return Promise.resolve(true);
    }
    return this.canDeactivateFormGuardService.canDeactivateForm(this.mapLocationForm.dirty && !this.mapLocationForm.pristine);
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }


  onAudioFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
    }
  }


  uploadAudio(): void {
    const newAudio: Audio = {
      id: null,
      name: this.audioForm.get('audioName').value,
      user: null,
      mapLocation: this.mapLocation,
      audioFilename: this.audioForm.get('audioName').value
    };

    this.audioService.postAudio(newAudio).subscribe(
      (audio: Audio) => {
        if (this.selectedAudioFile) {
          this.audioService.uploadAudioFile(audio.id, this.selectedAudioFile).subscribe(
            () => {
              this.audiosEntities.push(audio);
              this.selectedAudioFile = null;
              this.ngOnInit();
            },
            (error) => {
              console.error('Error uploading audio file:', error);
            }
          );
        } else {
          this.audiosEntities.push(audio);
          this.selectedAudioFile = null;
          this.ngOnInit();
        }
      },
      (error) => {
        console.error('Error adding audio:', error);
      }
    );

    this.fetchMapLocationAudio();
  }

  onSubmit() {
    this.submittingChangesInProcess = true;
    let newMapLocation = {
      name: this.mapLocationForm.value.name,
      description: this.mapLocationForm.value.description,
      coordinates: {
        type: "Point",
        coordinates: [this.mapLocationForm.value.lat, this.mapLocationForm.value.lng]
      },
    }


    if (this.editMode) {
      this.mapLocationService.putMapLocation(newMapLocation, this.mapLocationId)
        .subscribe((response: MapLocation) => {
          if (this.selectedFile) {
            this.mapLocationService.uploadMapLocationImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.goBack();
              });
          } else {
            this.goBack();
          }
          //this.goBack();
        });
    } else {
      this.mapLocationService.postMapLocation(newMapLocation, this.routeId)
        .subscribe((response: MapLocation) => {
          if (this.selectedFile) {
            this.mapLocationService.uploadMapLocationImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.routeMapLocationService.postRouteMapLocation(this.routeId, response.id)
                  .subscribe(() => {
                    this.goBack();
                  });
              });
          } else {
            this.routeMapLocationService.postRouteMapLocation(this.routeId, response.id)
              .subscribe(() => {
                this.goBack();
              });
          }
          this.uploadTemporaryAudios(response);
        });
    }


  }

  onSubmitAudio() {
    const audioFile = this.selectedAudioFile;
    if (audioFile) {
      if(this.editMode) {
        this.uploadAudio();
      } else {
        const objectURL = URL.createObjectURL(this.selectedAudioFile);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        const newTempAudio: Audio = {
          id: null,
          name: this.audioForm.get('audioName').value,
          user: null,
          mapLocation: null,  // MapLocation jeszcze nie istnieje
          audioFilename: this.selectedAudioFile.name
        };

        this.temporaryAudioData.push({ audio: newTempAudio, url: safeUrl,file:audioFile});
        this.selectedAudioFile = null;
      }
    } else {
      alert('Please select an audio file to upload.');
    }

    this.audioFileInput.nativeElement.value = '';
  }


  goBack() {
    if (this.editMode) {
      this.router.navigate([this.returnUrl])
    } else {
      this.router.navigate(['yourRoutes/' + this.routeId + '/edit']);
    }

  }

  private initForm() {
    let mapLocationName = '';
    let mapLocationDescription = '';
    let mapLocationLat = null;
    let mapLocationLng = null;

    this.mapLocationForm = new FormGroup({
      'name': new FormControl(mapLocationName, Validators.required),
      'description': new FormControl(mapLocationDescription),
      'lat': new FormControl(mapLocationLat, Validators.required),
      'lng': new FormControl(mapLocationLng, Validators.required),
    });


    if (this.editMode) {
      this.mapLocationService.getMapLocationsById(this.mapLocationId).subscribe(response => {
        this.mapLocation = response;

        mapLocationName = this.mapLocation.name;
        mapLocationDescription = this.mapLocation.description;
        mapLocationLat = this.mapLocation.coordinates.coordinates[0];
        mapLocationLng = this.mapLocation.coordinates.coordinates[1];

        this.mapLocationForm.patchValue({
          'name': mapLocationName,
          'description': mapLocationDescription,
          'lat': mapLocationLat,
          'lng': mapLocationLng
        });

        this.mapLocationService.getMapLocationImageById(this.mapLocationId).subscribe({
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
        })

        this.mapService.markerSelectedEmitter.emit({lat: mapLocationLat, lng: mapLocationLng});
      });
    }

  }

  private initForm2(){
    let audioName = '';
    this.audioForm = new FormGroup({
      'audioName': new FormControl(audioName,Validators.required),
    });
  }

  private fetchMapLocationAudio() {


    this.mapLocationService.getMapLocationsById(this.mapLocationId).subscribe(response => {
      this.mapLocation = response;

      this.audiosEntities = [];
      this.audioData = [];

      this.audioService.getAudiosByMapLocation(this.mapLocation, 0, maxPageSize).subscribe(response => {
        this.audiosEntities = response.content;

        const audioPromises = this.audiosEntities.map((audio, index) => {
          return this.audioService.getAudioFileByAudio(audio).toPromise()
            .then(response => {
              let audioUrl: SafeUrl = null;
              if (response) {
                const objectURL = URL.createObjectURL(response);
                audioUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
              this.audioData[index] = {audio: audio, url: audioUrl};
            })
            .catch(error => {
              console.log("getaudio error", error);
              this.audioData[index] = {audio: audio, url: null};
            });
        });

        Promise.all(audioPromises).then(() => {
        });
      });
    });
  }


  uploadTemporaryAudios(mapLocation: MapLocation) {
    this.temporaryAudioData.forEach((audioItem) => {
      const audioToSave = { ...audioItem.audio, mapLocation: mapLocation };
      this.audioService.postAudio(audioToSave).subscribe(
        (audio: Audio) => {
          if (audioItem.url) {
            this.audioService.uploadAudioFile(audio.id, audioItem.file).subscribe(
              () => {
                console.log('Audio file uploaded successfully.');
              },
              (error) => {
                console.error('Error uploading audio file:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error saving audio:', error);
        }
      );
    });

    this.temporaryAudioData = [];
  }

  deleteTemporaryAudio(audioItem: { audio: Audio, url: SafeUrl }) {
    this.temporaryAudioData = this.temporaryAudioData.filter(item => item !== audioItem);
  }

  deleteAudio(audioId: string) {
    this.audioService.deleteAudio(audioId).subscribe(
      () => {
        this.audiosEntities = this.audiosEntities.filter(audio => audio.id !== audioId);
        this.audioData = this.audioData.filter(item => item.audio.id !== audioId);
        console.log('Audio deleted successfully');
        this.fetchMapLocationAudio();
      },
      (error) => {
        console.error('Error deleting audio:', error);
      }
    );
  }

}
