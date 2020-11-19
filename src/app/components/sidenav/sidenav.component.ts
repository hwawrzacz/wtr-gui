import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @ViewChild('drawer')
  private drawer: MatSidenav;

  constructor() { }

  ngOnInit(): void {
    this.drawer.toggle();
  }

  public toggle() {
    console.log(this.drawer);
    console.log('toggle');
  }

}
