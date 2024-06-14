import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MapLocation} from "../map-location.model";
import {NgForOf, NgIf} from "@angular/common";
import {AudioService} from "../../audio/audio.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {maxPageSize} from "../../shared/http.config";
import {Audio} from "../../audio/audio.model";

@Component({
  selector: 'app-map-location-info-window',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './map-location-info-window.component.html',
  styleUrl: './map-location-info-window.component.css'
})
export class MapLocationInfoWindowComponent implements OnInit, OnChanges {

  @Input() mapLocation: MapLocation;
  audiosEntities: Audio[] = [];
  audiosUrls: SafeUrl[] = [];

  constructor(private audioService: AudioService, private sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.audiosEntities = [];
    this.audiosUrls = [];

    this.audioService.getAudiosByMapLocation(this.mapLocation, 0, maxPageSize).subscribe(response => {
      this.audiosEntities = response.content;

      console.log(this.audiosEntities);

      for (let audio of this.audiosEntities) {
        this.audioService.getAudioFileByAudio(audio).subscribe({
          next: (response: Blob | null) => {
            //convert Blob (raw byte object) to url
            if (response) {
              const objectURL = URL.createObjectURL(response);
              this.audiosUrls.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
            }

          },
          error: (error: any) => {
            //
            console.log("getaudio error")
          }
        });
      }
    });
  }


  ngOnInit(): void {
  }
}
