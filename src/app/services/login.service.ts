import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Position } from '../model/enums/position';
import { Section } from '../model/enums/section';
import { CommonResponse } from '../model/responses';
import { User } from '../model/user';
import { NavigatorService } from './navigator.service';
import { CommonRestService } from './rest/common-rest.service';
import { LoginRestService } from './rest/login-rest.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _user: User;
  private _isLoggedIn: boolean;

  //#region Getters and setters
  get user(): User {
    return this._user;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get isAdmin(): boolean {
    return this._user.role === Position.ADMIN;
  }

  get isManager(): boolean {
    return this._user.role === Position.MANAGER;
  }

  get isEmployee(): boolean {
    return this._user.role === Position.EMPLOYEE;
  }
  //#endregion

  constructor(
    private _navigator: NavigatorService<any>,
    private _restService: LoginRestService,
    private _snackBarService: SnackBarService
  ) {
    this._isLoggedIn = false;
  }

  public logIn(login: string, password: string): void {
    const passwdEncr = this.encryptPassword(password);
    this._restService.logIn(login, passwdEncr)
      .pipe(
        tap((res: CommonResponse<any, User>) => {
          res.success
            ? this.onLoginSuccess(res.details)
            : this.onLoginError(res.message);
        })
      ).subscribe();
  }

  public logOut(): void {
    this._restService.logOut()
      .pipe(
        tap((res: CommonResponse<any, any>) => {
          res.success
            ? this.onLogoutSuccess()
            : this.onLogoutError(res.message);
        })
      )
      .subscribe()
    this._user = null;
    this._navigator.navigateToHomeScreen();
  }


  private onLoginSuccess(user: User): void {
    this._user = user;
    this._snackBarService.openSuccessSnackBar('Zalogowano.');
    this._navigator.navigateToMainSection(Section.PROJECTS);
  }

  private onLoginError(message: string): void {
    const parsedMessage = this.parseLoginMessage(message);
    this._snackBarService.openErrorSnackBar('Nie udało się zalogować.');
  }

  private onLogoutSuccess(): void {
    this._snackBarService.openSuccessSnackBar('Wylogowano.');
    this._navigator.navigateToMainSection(Section.LOGIN);
  }

  private onLogoutError(message: string): void {
    const parsedMessage = this.parseLogoutMessage(message);
    this._snackBarService.openErrorSnackBar('Nie udało się wylogować.');
  }

  private encryptPassword(password: string): string {
    return atob(password);
  }

  private clearData(): void {
    this._user = null;
  }

  private parseLoginMessage(message: string): string {
    return message;
  }

  private parseLogoutMessage(message: string): string {
    return message;
  }
}
