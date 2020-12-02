import { Component, OnInit } from '@angular/core';
import { Section } from 'src/app/model/enums/section';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  get projectsSectionActive(): boolean {
    return this._navigator.activeSection === Section.PROJECTS;
  }

  get tasksSectionActive(): boolean {
    return this._navigator.activeSection === Section.TASKS;
  }

  get usersSectionActive(): boolean {
    return this._navigator.activeSection === Section.USERS;
  }

  get statisticsSectionActive(): boolean {
    return this._navigator.activeSection === Section.STATISTICS;
  }

  constructor(private _navigator: NavigatorService<any>) { }

  ngOnInit(): void {
  }
}
