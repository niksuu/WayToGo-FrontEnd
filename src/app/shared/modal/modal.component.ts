import {Component, ElementRef, OnInit, Renderer2} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {tadaAnimation} from "angular-animations";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
  ],
  animations: [
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent  {
  constructor(public el: ElementRef, private renderer: Renderer2) {}

  closeModal() {
    this.renderer.removeChild(document.body, this.el.nativeElement);
  }
}
