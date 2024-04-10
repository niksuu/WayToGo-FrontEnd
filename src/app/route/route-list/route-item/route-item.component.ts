import {Component, Input} from '@angular/core';
import {Route} from "../../route.model";


@Component({
  selector: 'app-route-item',
  standalone: true,
  imports: [],
  templateUrl: './route-item.component.html',
  styleUrl: './route-item.component.css'
})
export class RouteItemComponent {
  @Input() route: Route;
}
