import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {SnackbarService} from "../../shared/snackbar/snackbar.service";
import {SnackbarType} from "../../shared/snackbar/snackbar-type";

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

  constructor(private router: Router,
              private authService: AuthService,
              private snackbarService: SnackbarService,
  ) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.snackbarService.displaySnackbar("Wrong username or password", SnackbarType.DARK);
      }
    });
  }
}
