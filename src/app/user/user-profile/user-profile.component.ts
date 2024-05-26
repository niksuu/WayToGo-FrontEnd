import {Component, OnInit} from '@angular/core';
import {RouteService} from "../../route/route.service";
import {Route} from "../../route/route.model";
import {User} from "../user.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  this.user = new User("dupa", "test","dupa")

  }
}
