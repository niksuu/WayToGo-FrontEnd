import {Component, Input, OnInit} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Audio} from "../../audio/audio.model";
import {MapLocationService} from "../map-location.service";
import {AudioService} from "../../audio/audio.service";
import {ScreenSizeService} from "../../shared/screen-size.service";
import {maxPageSize} from "../../shared/http.config";
import {MapService} from "../../shared/map/map.service";

@Component({
  selector: 'app-map-location-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  animations: [],
  templateUrl: './map-location-modal.component.html',
  styleUrl: './map-location-modal.component.css'
})
export class MapLocationModalComponent implements OnInit {
  @Input() mapLocation: MapLocation;


  mapLocationImageUrl: SafeUrl;

  audiosEntities: Audio[] = [];
  audioData: { audio: Audio, url: SafeUrl }[] = [];
  mobileVersion: boolean;
  isError: boolean;
  isLoading: boolean;

  constructor(
              private mapLocationService: MapLocationService,
              private audioService: AudioService,
              private mapService: MapService,
              private sanitizer: DomSanitizer,
              private screenSizeService: ScreenSizeService) {
  }

  ngOnInit(): void {

    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    if (this.mapLocation) {
      this.fetchMapLocationAudio();
      this.fetchMapLocationImage();
    }
  }


  private fetchMapLocationImage() {
    this.mapLocationService.getMapLocationImageById(this.mapLocation.id).subscribe({
      next: (response: Blob | null) => {
        if (response) {
          const objectURL = URL.createObjectURL(response);
          this.mapLocationImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }},
      error: (error: any) => {
      }
    });
  }


  private fetchMapLocationAudio() {
    this.isLoading= true;
    this.isError = false;
    this.audiosEntities = [];
    this.audioData = [];
    this.audioService.getAudiosByMapLocation(this.mapLocation, 0, maxPageSize).subscribe({
      next: (response) => {
        this.audiosEntities = response.content;

        const audioPromises = this.audiosEntities.map((audio, index) => {
          return this.audioService.getAudioFileByAudio(audio).toPromise()
            .then((audioBlob) => {
              let audioUrl: SafeUrl = null;
              if (audioBlob) {
                const objectURL = URL.createObjectURL(audioBlob);
                audioUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
              this.audioData[index] = {audio, url: audioUrl};
            })
            .catch(error => {
              console.error("Error fetching audio:", error);
              this.audioData[index] = {audio, url: null};
            });
        });
        Promise.all(audioPromises).then(() => {
          this.isLoading = false;
        }).catch(() => {
          this.isError = true;
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Error fetching audio:', error);
        this.isError = true;
        this.isLoading= false;
      }
    });
  }


  onCalculateRoute() {

    const selectedLocation: MapLocation = {
      name: this.mapLocation.name,
      id: this.mapLocation.id,
      coordinates: this.mapLocation.coordinates
    };

    this.mapService.mapLocationDetailsEventEmitter.emit(selectedLocation);
  }
}
