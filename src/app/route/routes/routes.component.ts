import { Component } from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {

}
