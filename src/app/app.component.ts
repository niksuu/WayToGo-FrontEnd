import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./header/header.component";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule, HeaderComponent]
})
export class AppComponent {
  title = 'WayToGo-FrontEnd';
}
