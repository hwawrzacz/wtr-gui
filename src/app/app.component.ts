import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wtr-gui';

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor() { }

  get sidenavOpened(): boolean {
    return this.sidenav ? this.sidenav.opened : false;
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}
