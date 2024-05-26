import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  login: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const user = {
      username: this.username,
      password: this.password,
      login: this.login
    };

    this.authService.register(user).subscribe({
      next: response => {
        this.router.navigate(['/log-in']);
      },
      error: err => {
        console.error('Registration failed', err);
        // handle error (show message to user, etc.)
      }
    });
  }
}
