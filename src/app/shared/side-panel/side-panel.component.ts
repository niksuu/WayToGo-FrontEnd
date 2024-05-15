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
    const targetElement = event.target as Element;
    if (targetElement && !targetElement.closest('.panel-container') && !targetElement.closest('.detail-button')) {
      console.log("NO NIE DOBRZE");
      this.toggleSidePanel = false;
    }
  }


  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";
  }
}
