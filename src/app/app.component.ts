import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';

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
