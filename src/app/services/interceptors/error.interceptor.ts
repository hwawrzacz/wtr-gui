import {
  HttpEvent, HttpHandler,

  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { NavigatorService } from '../navigator.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private _navigator: NavigatorService<any>,
    private _authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this._authService.logout();
            this._navigator.navigateToHomeScreen();
          }

          const error = err.error.message || err.statusText;
          return throwError(error);
        }));
  }
}
