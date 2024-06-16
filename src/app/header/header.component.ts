import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {DropdownDirective} from "../shared/dropdown.directive";
import {AuthService} from "../auth/auth.service";
import {ScreenSizeService} from "../shared/screen-size.service";

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
  isLoggedIn: boolean = false;


  constructor(public authService: AuthService, private router: Router, private screenSizeService: ScreenSizeService) {
  }



  ngOnInit(): void {
    this.collapsed = true;

    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
      this.collapsed = true;
    });

    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/log-in']);
  }

}
