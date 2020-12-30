import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Position } from '../model/enums/position';
import { Section } from '../model/enums/section';
import { CommonResponse } from '../model/responses';
import { User } from '../model/user';
import { NavigatorService } from './navigator.service';
import { LoginRestService } from './rest/login-rest.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;

  //#region Getters and setters
  get user(): User {
    return this._user;
  }

  get isLoggedIn(): boolean {
    return !!this._user;
  }

  get isAdmin(): boolean {
    return !!this._user && this._user.role === Position.ADMIN;
  }

  get isManager(): boolean {
    return !!this._user && this._user.role === Position.MANAGER;
  }

  get isEmployee(): boolean {
    return !!this._user && this._user.role === Position.EMPLOYEE;
  }
  //#endregion

  constructor(
    private _navigator: NavigatorService<any>,
    private _restService: LoginRestService,
    private _snackBarService: SnackBarService
  ) { }

  public faceLogIn(imageUrl: string): Observable<CommonResponse<any, User>> {
    return this._restService.faceLogIn(imageUrl)
      .pipe(
        tap((res: CommonResponse<any, User>) => {
          this.handleLoginResponse(res);
        })
      );
  }

  public logIn(login: string, password: string,): Observable<CommonResponse<any, User>> {
    // TODO: Encrypt password 
    // const passwdEncr = this.encryptPassword(password);
    const passwdEncr = password;
    return this._restService.logIn(login, passwdEncr)
      .pipe(
        tap((res: CommonResponse<any, User>) => {
          this.handleLoginResponse(res);
        })
      );
  }

  /** Logs user out, show message depending the response and 
   * navigate to login page if logout was performed successfully */
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

  private handleLoginResponse(res: CommonResponse<any, User>) {
    if (res.success) {
      this.setUserBasedOnLoginResponse(res.details);
      this.onLoginSuccessDefault();
    } else {
      this.onLoginErrorDefault(res.message);
    }
  }

  private setUserBasedOnLoginResponse(user: User): void {
    this._user = user;
  }

  private onLoginSuccessDefault(): void {
    this._snackBarService.openSuccessSnackBar('Zalogowano.');
    this._navigator.navigateToMainSection(Section.TASKS);
  }

  private onLoginErrorDefault(message: string): void {
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
    return btoa(password);
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
