import { Component, ViewChild } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wtr-gui';

  @ViewChild('sidenav')
  sidenav;

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
