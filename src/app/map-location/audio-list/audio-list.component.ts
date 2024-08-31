import {Component, Input, OnInit} from '@angular/core';
import { AudioService } from '../../audio/audio.service';
import { Audio } from '../../audio/audio.model';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import {maxPageSize} from "../../shared/http.config";

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  standalone: true,
  styleUrls: ['./audio-list.component.css']
})
export class AudioListComponent implements OnInit {
  @Input() mapLocation: any; // Assuming mapLocation is passed as input
  audioData: { audio: Audio, url: SafeUrl }[] = [];
  audiosEntities: Audio[] = [];
  userMode: boolean = true; // Assume user mode is enabled for demonstration

  constructor(private audioService: AudioService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.fetchAudioFiles();
  }

  fetchAudioFiles(): void {
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

  deleteAudio(audioId: string): void {
    this.audioService.deleteAudio(audioId).subscribe(() => {
      this.audioData = this.audioData.filter(audioItem => audioItem.audio.id !== audioId);
      console.log('Audio deleted successfully');
    }, error => {
      console.error('Error deleting audio:', error);
    });
  }
}
