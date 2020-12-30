import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavigatorService } from '../services/navigator.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsGuard implements CanActivate {
  constructor(
    private _navigator: NavigatorService<any>,
    private _authService: AuthService,
    private _snackBarService: SnackBarService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authService.isManager) {
      return true;
    } else {
      this._snackBarService.openErrorSnackBar('Wymagane wyższe uprawnienia.');
      return false;
    };
  }

}
