import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'wtr-gui';

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor() { }

  ngAfterViewInit() {
    this.sidenav.toggle();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
