import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Audio} from "../../audio/audio.model";
import {MapService} from "../../shared/map/map.service";
import {SidePanelService} from "../../shared/side-panel.service";
import {MapLocationService} from "../map-location.service";
import {AudioService} from "../../audio/audio.service";
import {ScreenSizeService} from "../../shared/screen-size.service";
import {RouteService} from "../../route/route.service";
import {maxPageSize} from "../../shared/http.config";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
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

  constructor(private mapService: MapService,
              private sidePanelService: SidePanelService,
              private mapLocationService: MapLocationService,
              private audioService: AudioService,
              private sanitizer: DomSanitizer,
              private screenSizeService: ScreenSizeService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeService: RouteService) {
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

  //fetch images for map locations
  private fetchMapLocationImage() {
    this.mapLocationService.getMapLocationImageById(this.mapLocation.id).subscribe({
      next: (response: Blob | null) => {
        if (response) {
          //convert Blob (raw byte object) to url to display it in the template
          const objectURL = URL.createObjectURL(response);
          this.mapLocationImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
      },
      error: (error: any) => {
        //
      }
    });
  }


  private fetchMapLocationAudio() {
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
        // All audio files fetched and URLs are set
      });
    });
  }

}
