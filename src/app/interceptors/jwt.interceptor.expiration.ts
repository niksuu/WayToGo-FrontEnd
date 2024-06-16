import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../auth/auth.service";

export const jwtInterceptorExpiration: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  authService.isLoggedIn()

  return next(req);
};
