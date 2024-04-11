import {Component, Input} from '@angular/core';
import {Route} from "../../route.model";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-route-item',
  standalone: true,
  imports: [],
  templateUrl: './route-item.component.html',
  styleUrl: './route-item.component.css'
})
export class RouteItemComponent {
  @Input() route: Route;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  onEditItem() {
    this.router.navigate([this.route.id + '/edit'], {relativeTo: this.activatedRoute});
  }
}
