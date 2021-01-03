import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavigatorService } from '../services/navigator.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {
  constructor(
    private _navigator: NavigatorService<any>,
    private _authService: AuthService,
    private _snackBarService: SnackBarService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = `/${next.url.map(segment => segment.path).join('/')}`;
    if (
      // If is admin or manager
      (this._authService.isAdmin || this._authService.isManager)
      // If is regular employee, and trying to view its own profile
      || (this._authService.isEmployee && this._navigator.getIdFromUrl(url) === this._authService.user._id)) {
      return true;
    } else {
      this._snackBarService.openErrorSnackBar('Wymagane wyższe uprawnienia.');
      return false;
    };
  }

}
