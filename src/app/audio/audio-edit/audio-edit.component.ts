import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Audio } from '../../audio/audio.model';
import { AudioService } from '../../audio/audio.service';
import { MapLocationService } from '../../map-location/map-location.service';
import { MapLocation } from '../../map-location/map-location.model';
import {SafeUrl} from "@angular/platform-browser";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {PointSelectMapComponent} from "../../map-location/point-select-map/point-select-map.component";

@Component({
  selector: 'app-audio-edit',
  templateUrl: './audio-edit.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    CommonModule,
    PointSelectMapComponent,
    RouterLink,
  ],
  styleUrls: ['./audio-edit.component.css']
})
export class AudioEditComponent implements OnInit {
  mapLocationForm: FormGroup;
  mapLocation: MapLocation;
  audioId: string;
  audioForm: FormGroup;
  audio: Audio;
  audiosEntities: Audio[] = [];
  audioData: { audio: Audio, url: SafeUrl }[] = [];
  selectedAudioFile: File = null;


  constructor(
    private route: ActivatedRoute,
    private audioService: AudioService,
    private mapLocationService: MapLocationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.audioId = params['id'];
      this.loadAudio();
    });

    this.audioForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null)
      // Dodaj inne pola formularza, jeśli są potrzebne
    });
  }

  loadAudio() {
    this.audioService.getAudioById(this.audioId).subscribe(
      (audio: Audio) => {
        this.audio = audio;
        this.audioForm.patchValue({
          'name': this.audio.name,
          'description': this.audio.description
          // Uzupełnij inne pola audio, jeśli są potrzebne
        });

        // Pobierz dane mapLocation
        if (this.audio.mapLocation) {
          this.loadMapLocation(this.audio.mapLocation.id);
        }
      },
      (error) => {
        console.error('Error loading audio:', error);
      }
    );
  }


  onAudioFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
    }
  }

  loadMapLocation(mapLocationId: string) {
    this.mapLocationService.getMapLocationsById(mapLocationId).subscribe(
      (mapLocation: MapLocation) => {
        this.mapLocation = mapLocation;
      },
      (error) => {
        console.error('Error loading map location:', error);
        // Możesz obsłużyć błędy ładowania lokalizacji mapy tutaj
      }
    );
  }

  onSubmit() {
    if (this.audioForm.valid) {
      const editedAudio: Audio = {
        id: this.audio.id,
        name: this.audioForm.value.name,
        description: this.audioForm.value.description,
        mapLocation: this.mapLocation,
        user: null,
        audioFilename: this.audioForm.value.name
        // Dodaj inne pola audio, jeśli są potrzebne
      };

      this.audioService.updateAudio(editedAudio).subscribe(
        (updatedAudio: Audio) => {
          if (this.selectedAudioFile) {
            this.audioService.uploadAudioFile(updatedAudio.id, this.selectedAudioFile).subscribe(
              () => {
                this.audiosEntities.push(updatedAudio);
                this.selectedAudioFile = null;
              },
              (error) => {
                console.error('Error uploading audio file:', error);
              }
            );
          } else {
            this.audiosEntities.push(updatedAudio);
          }
        },
        (error) => {
          console.error('Error updating audio:', error);
        }
      );
    }
    this.goBack();
  }


  deleteAudio() {
    this.audioService.deleteAudio(this.audioId).subscribe(
      () => {
        this.audiosEntities = this.audiosEntities.filter(audio => audio.id !== this.audioId);
        console.log('Audio deleted successfully');
      },
      (error) => {
        console.error('Error deleting audio:', error);
      }
    );
    this.goBack();
  }

  goBack() {
    this.router.navigate(['point/' + this.mapLocation.id + '/edit']);
  }
}
