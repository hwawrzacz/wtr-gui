import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Section } from 'src/app/model/enums/section';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output('navigationChanged') private _navigationChangeEmitter: EventEmitter<void>;

  //#region Getters and setters
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
  //#endregion

  constructor(private _navigator: NavigatorService<any>) {
    this._navigationChangeEmitter = new EventEmitter();
  }

  ngOnInit(): void { }

  public onNavigateTo(path: string): void {
    this._navigator.navigateToMainSection(path);
    this._navigationChangeEmitter.emit();
  }
}
