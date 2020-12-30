import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Section } from 'src/app/model/enums/section';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private _navigator: NavigatorService<any>, private _authService: AuthService) {
    this._navigationChangeEmitter = new EventEmitter();
  }

  ngOnInit(): void { }

  public onNavigateTo(path: string): void {
    this._navigator.navigateToMainSection(path);
    this._navigationChangeEmitter.emit();
  }

  public canShow(section: string): boolean {
    switch (section) {
      case Section.USERS:
        return this._authService.isManager || this._authService.isAdmin;
      case Section.STATISTICS:
        return this._authService.isManager;
      case Section.TASKS:
        return this._authService.isEmployee || this._authService.isManager || this._authService.isAdmin;
      case Section.PROJECTS:
        return this._authService.isEmployee || this._authService.isManager || this._authService.isAdmin;
    }
  }
}
