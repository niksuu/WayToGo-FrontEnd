import {Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MapLocationService} from "../map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {Route} from "../../route/route.model";
import {MapLocation} from "../map-location.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "../../route/route-list/route-item/route-item.component";
import {ActivatedRoute, Router, RouterLinkActive} from "@angular/router";
import {SidePanelService} from "../../shared/side-panel.service";
import {MapService} from "../../shared/map/map.service";
import {AudioService} from "../../audio/audio.service";
import {Audio} from "../../audio/audio.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ScreenSizeService} from "../../shared/screen-size.service";

@Component({
  selector: 'app-map-location-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  templateUrl: './map-location-list.component.html',
  styleUrl: './map-location-list.component.css'
})
export class MapLocationListComponent implements OnInit {

  @Input() route: Route;
  mapLocations: MapLocation[];
  activeMapLocationId: string;

  audiosEntities: Audio[] = [];
  audiosUrls: SafeUrl[] = [];
  audioData: { audio: Audio, url: SafeUrl }[] = [];

  mobileVersion: boolean;

  constructor(private mapService: MapService,
              private sidePanelService: SidePanelService,
              private mapLocationService: MapLocationService,
              private audioService: AudioService,
              private sanitizer: DomSanitizer,
              private renderer: Renderer2,
              private screenSizeService: ScreenSizeService) {
  }


  @ViewChild('info') infoWrapper: ElementRef;

  ngOnInit(): void {

    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    this.mapService.mapLocationDetailsEventEmitter.subscribe(mapLocation => {
      this.onMapLocationSelected(mapLocation);


      this.sidePanelService.togglePanelEventEmitter.emit(true);




      this.infoWrapper.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (this.infoWrapper.nativeElement) {
        this.renderer.addClass(this.infoWrapper.nativeElement, 'animation');
        this.infoWrapper.nativeElement.addEventListener('animationend', () => {
          this.renderer.removeClass(this.infoWrapper.nativeElement, 'animation');
        }, { once: true });
      }
    })


    this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
      .subscribe(response => {
        this.mapLocations = response.content;
        this.mapService.routeSelectedEventEmitter.emit(this.mapLocations);
      });


  }

  onMapLocationSelected(mapLocation: MapLocation) {
    this.mapService.centerOnMapLocation.emit(mapLocation);
    if(this.activeMapLocationId != mapLocation.id) {
      this.activeMapLocationId = mapLocation.id;
      if (this.mobileVersion) {
        this.sidePanelService.togglePanelEventEmitter.emit(false);
      }
      this.fetchMapLocationAudio(mapLocation);
    }
  }

  private fetchMapLocationAudio(mapLocation: MapLocation) {
    this.audiosEntities = [];
    this.audioData = [];

    this.audioService.getAudiosByMapLocation(mapLocation, 0, maxPageSize).subscribe(response => {
      this.audiosEntities = response.content;

      const audioPromises = this.audiosEntities.map((audio, index) => {
        return this.audioService.getAudioFileByAudio(audio).toPromise()
          .then(response => {
            let audioUrl: SafeUrl = null;
            if (response) {
              const objectURL = URL.createObjectURL(response);
              audioUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
            this.audioData[index] = { audio: audio, url: audioUrl };
          })
          .catch(error => {
            console.log("getaudio error", error);
            this.audioData[index] = { audio: audio, url: null };
          });
      });

      Promise.all(audioPromises).then(() => {
        //All audio files fetched and URLs are set
      });
    });
  }


}
