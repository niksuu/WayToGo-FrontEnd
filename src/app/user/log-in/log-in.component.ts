import { Component } from '@angular/core';
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Login failed', err);
        // handle error (show message to user, etc.)
      }
    });
  }
}
