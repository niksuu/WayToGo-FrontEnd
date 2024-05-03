import {Component, HostListener} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";



@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {
  panelVisible: boolean = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (event.target && !(<Element>event.target).closest('#slide-panel')) {
      this.closePanel();
    }
  }

  togglePanel() {
    this.panelVisible = !this.panelVisible;
  }

  closePanel() {
    this.panelVisible = false;
  }

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  onAddNewRoute(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}
