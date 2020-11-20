import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //#region Fields definitions
  private _title = 'Somecompany';
  private _sidenavMode = 'side';

  @ViewChild(MatSidenav)
  private _sidenav: MatSidenav;
  //#endregion

  constructor() { }

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

  toggleSidenav(): void {
    this._sidenav.toggle();
  }
}
