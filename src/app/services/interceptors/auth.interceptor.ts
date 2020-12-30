import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HEADER_TOKEN } from 'src/app/model/constants';
import { AuthService } from '../auth.service';
import { NavigatorService } from '../navigator.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _navigator: NavigatorService<any>,
    private _authService: AuthService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this._authService.isLoggedIn) {
      request = request.clone({
        setHeaders: {
          [HEADER_TOKEN]: this._authService.token,
        }
      });
    }
    return next.handle(request);
  }
}
