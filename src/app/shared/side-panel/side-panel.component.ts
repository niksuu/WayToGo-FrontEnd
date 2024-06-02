import {Component, HostListener, OnInit} from '@angular/core';
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
export class SidePanelComponent  implements OnInit{

  toggleSidePanel = true;
  panelButtonContent: string = "";

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as Element;
    if (!!targetElement.closest('.map-wrapper')) {
      this.toggleSidePanel = false;

    }
  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";
  }

  ngOnInit(): void {
    this.toggleSidePanel = true;
  }
}
