import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Section } from './model/enums/section';
import { NavigatorService } from './services/navigator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  //#region Fields definitions
  private _title = 'Somecompany';
  private _sidenavMode = 'push';

  @ViewChild(MatSidenav)
  private _sidenav: MatSidenav;

  @ViewChild('header', { read: ElementRef }) private _header: ElementRef;
  //#endregion

  //#region Getters and setters
  get loginAppBar(): boolean {
    return this._navigator.activeSection === Section.LOGIN;
  }

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

  constructor(private _navigator: NavigatorService<any>) { }

  ngAfterViewInit(): void {
    this.subscribeToHeaderClicksForHidingSidenav();
  }

  /**  That's a trick. Previously, the sidebar wouldn't hide, when clicked other things 
   * that sidebar contaier or toggle button, which means, that performing logout didn't 
   * hide the sidebar, which leaded to bad UI appearance. The thing below, closes sidenav
   *  when something on header except sidenav toggle button is clicked. Sidenav toggle 
   * button is excluded from targets, because sidenav was opened before click event was 
   * hadled, so sidenav was being closed immediately after opening.*/
  private subscribeToHeaderClicksForHidingSidenav(): void {
    this._header.nativeElement.addEventListener('click', (e) => {
      const menuButtonClicked = e.path.filter(el => el.id === 'menuButton').length > 0;
      if (!menuButtonClicked) {
        this.closeSidenav();
      }
    });
  }

  public toggleSidenav(): void {
    this._sidenav.toggle();
  }

  public closeSidenav(): void {
    this._sidenav.close();
  }
}
