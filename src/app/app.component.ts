import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Section } from './model/enums/section';
import { LoginService } from './services/login.service';
import { NavigatorService } from './services/navigator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //#region Fields definitions
  private _title = 'Somecompany';
  private _sidenavMode = 'push';

  @ViewChild(MatSidenav)
  private _sidenav: MatSidenav;
  //#endregion

  //#region Getters and setters
  get displayAppBar(): boolean {
    return this._navigator.activeSection !== Section.LOGIN;
  }
  //#endregion

  constructor(private _loginService: LoginService, private _navigator: NavigatorService<any>) { }

  //#region Getters and setters
  get title(): string {
    return this._title;
  }

  get sidenavMode(): string {
    return this._sidenavMode;
  }

  get sidenavOpened(): boolean {
    return this._sidenav ? this._sidenav.opened : false;
  }
  //#endregion

  public toggleSidenav(): void {
    this._sidenav.toggle();
  }

  public closeSidenav(): void {
    this._sidenav.close();
  }
}
