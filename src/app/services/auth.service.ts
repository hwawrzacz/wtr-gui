import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, takeUntil } from 'rxjs/operators';
import { HEADER_TOKEN } from '../model/constants';
import { Position } from '../model/enums/position';
import { Section } from '../model/enums/section';
import { CommonResponse } from '../model/responses';
import { User } from '../model/user';
import { NavigatorService } from './navigator.service';
import { LoginRestService } from './rest/login-rest.service';
import { SnackBarService } from './snack-bar.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  private _token: string;

  //#region Getters and setters
  get userId(): string {
    return this._user ? this._user._id : null;
  }

  get user(): User {
    return this._user;
  }

  get token(): string {
    return this._token;
  }

  get isLoggedIn(): boolean {
    return !!this._user && !!this._token;
  }

  get isAdmin(): boolean {
    return this.isLoggedIn && this._user.role === Position.ADMIN;
  }

  get isManager(): boolean {
    return this.isLoggedIn && this._user.role === Position.MANAGER;
  }

  get isEmployee(): boolean {
    return this.isLoggedIn && this._user.role === Position.EMPLOYEE;
  }
  //#endregion

  constructor(
    private _navigator: NavigatorService<any>,
    private _restService: LoginRestService,
    private _snackBarService: SnackBarService,
    private _storageService: StorageService,
  ) {
    this._user = this._storageService.getUser();
    this._token = this._storageService.getToken();
    // this.setUpLastUrlListener();
  }

  private setUpLastUrlListener(): void {
    this._navigator.lastUrlInHistory$
      .pipe(
        tap(() => this.logout())
      )
      .subscribe
  }

  public faceLogIn(imageUrl: string): Observable<CommonResponse<any, User>> {
    return this._restService.faceLogIn(imageUrl)
      .pipe(
        tap((res: HttpResponse<CommonResponse<any, User>>) => {
          this.handleLoginResponse(res);
        }),
        map(res => res.body),
        catchError(err => this.onRequestErrorDefault(err)),
      );
  }

  public logIn(login: string, password: string,): Observable<CommonResponse<any, User>> {
    return this._restService.logIn(login, password)
      .pipe(
        tap((res: HttpResponse<CommonResponse<any, User>>) => {
          this.handleLoginResponse(res);
        }),
        map(res => res.body),
        catchError(err => this.onRequestErrorDefault(err))
      );
  }

  /** Logs user out, show message depending the response and 
   * navigate to login page if logout was performed successfully */
  public logout(): void {
    this._restService.logOut()
      .pipe(
        tap((res: CommonResponse<any, any>) => {
          res.success
            ? this.onLogoutSuccess()
            : this.onLogoutError(res.message);
        })
      )
      .subscribe()
  }

  private handleLoginResponse(res: HttpResponse<CommonResponse<any, User>>) {
    const body = res.body;
    if (body.success) {
      this.setUserBasedOnLoginResponse(body.details);
      this.setTokenBasedOnLoginResponse(res.headers);
      this.onLoginSuccessDefault();
    } else {
      this.onLoginErrorDefault(body.message);
    }
  }

  private setUserBasedOnLoginResponse(user: User): void {
    this._user = user;
    this._storageService.setUser(user);
  }

  private setTokenBasedOnLoginResponse(headers: HttpHeaders): void {
    const token = headers.get(HEADER_TOKEN);
    this._token = token;
    this._storageService.setToken(token);
  }

  private onLoginSuccessDefault(): void {
    this._snackBarService.openSuccessSnackBar('Zalogowano.');
    this._navigator.navigateToMainSection(Section.TASKS);
  }

  private onLoginErrorDefault(message: string): void {
    const parsedMessage = this.parseLoginMessage(message);
    this._snackBarService.openErrorSnackBar('Nie udało się zalogować.');
  }

  private onRequestErrorDefault(res: HttpErrorResponse): Observable<CommonResponse<any, User>> {
    const errMessage = `${res.status} ${res.statusText}.`;
    this._snackBarService.openErrorSnackBar('Nie udało się zalogować.', errMessage);
    return of({ success: false } as CommonResponse<any, User>);
  }

  private onLogoutSuccess(): void {
    this.clearData();
    this._snackBarService.openSuccessSnackBar('Wylogowano.');
    this._navigator.goToRootHistoryElement()
    this._navigator.navigateToHomeScreen();
  }

  private onLogoutError(message: string): void {
    const parsedMessage = this.parseLogoutMessage(message);
    this._snackBarService.openErrorSnackBar('Nie udało się wylogować.');
  }

  private clearData(): void {
    this._user = null;
    this._storageService.clearAuthData();
  }

  private parseLoginMessage(message: string): string {
    return message;
  }

  private parseLogoutMessage(message: string): string {
    return message;
  }
}
