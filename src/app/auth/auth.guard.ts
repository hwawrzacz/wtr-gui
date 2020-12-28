import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { NavigatorService } from '../services/navigator.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _navigator: NavigatorService<any>,
    private _loginService: LoginService,
    private _snackBarService: SnackBarService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._loginService.isLoggedIn) {
      return true;
    } else {
      this._snackBarService.openErrorSnackBar('Użytkownik nie jest zalogowany.')
      this._navigator.navigateToHomeScreen();
      return false;
    }
  }

}
