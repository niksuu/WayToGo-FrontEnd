import {Component, ElementRef, Input, OnInit, Renderer2} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {tadaAnimation} from "angular-animations";
import {ModalService} from "../../shared/modal/modal.service";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
  ],
  animations: [
  ],
  templateUrl: './map-location-modal.component.html',
  //styleUrl: './map-location-modal.component.css'
})
export class MapLocationModalComponent implements OnInit {
  @Input() data: string = '';

  constructor(private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.modalService.openModal(MapLocationModalComponent,   { data: 'Hrrfrfrf!' })
  }

  onClick() {

  }
}
