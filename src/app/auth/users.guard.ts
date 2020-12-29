import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { NavigatorService } from '../services/navigator.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {
  constructor(
    private _navigator: NavigatorService<any>,
    private _loginService: LoginService,
    private _snackBarService: SnackBarService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (
      // If is admin or manager
      this._loginService.isAdmin || this._loginService.isManager
      // If is regular employee, and trying to view its own profile
      || this._loginService.isEmployee && this._navigator.getIdFromUrl(next.url) === this._loginService.user._id) {
      return true;
    } else {
      this._snackBarService.openErrorSnackBar('Wymagane wyższe uprawnienia.');
      return false;
    };
  }

}
