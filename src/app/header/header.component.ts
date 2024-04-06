import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {DropdownDirective} from "../shared/dropdown.directive";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  collapsed = true;

}
