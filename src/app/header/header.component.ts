import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
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
export class HeaderComponent implements OnInit {
  collapsed = true;
  mobileVersion: boolean;
  mobileBoundary: number = 800;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileVersion = window.innerWidth < this.mobileBoundary ? true : false;
    this.collapsed = true;

  }


  ngOnInit(): void {
    this.collapsed = true;
    this.mobileVersion = window.innerWidth < this.mobileBoundary ? true : false;
  }

}
