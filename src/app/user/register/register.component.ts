import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {SnackbarService} from "../../shared/snackbar/snackbar.service";
import {SnackbarType} from "../../shared/snackbar/snackbar-type";

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

  constructor(private router: Router,
              private authService: AuthService,
              private snackbarService: SnackbarService,
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackbarService.displaySnackbar('Passwords do not match',SnackbarType.DARK);
      return;
    }

    const user = {
      username: this.username,
      password: this.password,
      login: this.login
    };

    this.authService.register(user).subscribe({
      next: response => {
        this.snackbarService.displaySnackbar('Your registration was successful!',SnackbarType.DARK);
        this.router.navigate(['/log-in']);
      },
      error: err => {
        this.snackbarService.displaySnackbar('Username already exist',SnackbarType.DARK);
      }
    });
  }
}
