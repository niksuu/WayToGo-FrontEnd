import {Component, HostListener} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {

  toggleSidePanel = true;
  panelButtonContent: string = "";

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (event.target && !(<Element>event.target).closest('.panel-container')) {
      this.toggleSidePanel = false;
    }
  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";
  }
}
