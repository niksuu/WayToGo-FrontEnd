import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {bounceInDownAnimation, headShakeAnimation} from "angular-animations";
import {RouteService} from "../../route/route.service";

@Component({
  selector: 'app-map-location-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass,
    NgIf,

  ],
  animations: [
    headShakeAnimation()
  ],
  templateUrl: './map-location-list.component.html',
  styleUrl: './map-location-list.component.css'
})
export class MapLocationListComponent implements OnInit, OnChanges {

  @Input() route: Route;
  mapLocations: MapLocation[];
  mapLocationsAndImages: { mapLocation: MapLocation, url: SafeUrl }[] = [];
  activeMapLocationId: string;

  audiosEntities: Audio[] = [];
  audioData: { audio: Audio, url: SafeUrl }[] = [];
  mobileVersion: boolean;

  @ViewChild('info') infoWrapper: ElementRef;
  infoWrapperAnimationState: boolean;

  userMode = false;

  constructor(private mapService: MapService,
              private sidePanelService: SidePanelService,
              private mapLocationService: MapLocationService,
              private audioService: AudioService,
              private sanitizer: DomSanitizer,
              private screenSizeService: ScreenSizeService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private routeService: RouteService) { }



  ngOnInit(): void {
    this.routeService.isUserMode(this.activatedRoute, this.router).subscribe(response => {
      this.userMode = response;
    })

    this.infoWrapperAnimationState = false;
    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    //subscribe to event emitted by map location in map info window
    this.mapService.mapLocationDetailsEventEmitter.subscribe(mapLocation => {
      this.onMapLocationSelected(mapLocation);
      this.activeMapLocationId = mapLocation.id;
      this.sidePanelService.togglePanelEventEmitter.emit(true);
      this.scrollToInfoWrapper();
    });

    if (this.route) {
      this.fetchMapLocations();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['route'] && changes['route'].currentValue) {
      this.fetchMapLocations();
    }
  }

  onMapLocationSelected(mapLocation: MapLocation) {
    //this.infoWrapperAnimationState = false;

    this.mapService.centerOnMapLocation.emit(mapLocation);
    if(this.activeMapLocationId == mapLocation.id) {
      this.activeMapLocationId = null;
    }
    else {
      this.activeMapLocationId = mapLocation.id;
      if (this.mobileVersion) {
        this.sidePanelService.togglePanelEventEmitter.emit(false);
      }
      this.fetchMapLocationAudio(mapLocation);
    }

    //this.scrollToInfoWrapper(); if we want to add animation on list item click
  }

  //scroll to map location info and animate it
  private scrollToInfoWrapper() {
    setTimeout(() => {
      if (this.infoWrapper) {
        this.infoWrapper.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.infoWrapperAnimationState = false;
        setTimeout(() => {
          this.infoWrapperAnimationState = true;
        }, 1);
      } else {
        console.error('infoWrapper  not available');
      }
    }, 1);
  }

  //fetch map locations and their images
  private fetchMapLocations() {
    this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
      .subscribe(response => {
        this.mapLocations = response.content;
        this.loadImagesForMapLocations();
        this.mapService.routeSelectedEventEmitter.emit(this.mapLocations);
      });
  }

  //fetch images for map locations
  private loadImagesForMapLocations() {
    const imageRequests = this.mapLocations.map(ml => {
      return this.mapLocationService.getMapLocationImageById(ml.id).pipe(
        map(response => {
          if (response) {
            const objectURL = URL.createObjectURL(response);
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            return { mapLocation: ml, url: imageUrl };
          } else {
            return { mapLocation: ml, url: null };
          }
        })
      );
    });

    //execute all requests concurrently and wait for their execution
    forkJoin(imageRequests).subscribe({
      next: (results) => {
        this.mapLocationsAndImages = results;
      },
      error: (error) => {
        console.error('Error loading images:', error);
      }
    });
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
        // All audio files fetched and URLs are set
      });
    });
  }

  onMapLocationEdit(mapLocationId: string) {
    this.router.navigate(['point/' + mapLocationId + '/edit'])
  }

  onMapLocationDelete(mapLocationId: string) {
    if (confirm("You are about to delete map location. Do you want to continue?")) {
      this.mapLocationService.deleteMapLocationFromRoute(mapLocationId, this.route.id).subscribe( () => {
        this.router.navigate(['yourRoutes/list'])
      });
    }
  }
}
