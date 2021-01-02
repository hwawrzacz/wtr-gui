import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  private _loginAppBar: boolean;
  private _sidenavOpened: boolean;

  @Output()
  toggleSidenav = new EventEmitter();


  //#region Getters and setters
  @Input('loginAppBar')
  set loginAppBar(value: boolean) {
    this._loginAppBar = value;
  }
  get loginAppBar(): boolean {
    return this._loginAppBar;
  }

  @Input('sidenavOpened')
  set sidenavOpened(value: boolean) {
    this._sidenavOpened = value;
  }

  get isMobile(): boolean {
    return this._mobileDetector.isMobile;
  }

  get iconName(): string {
    return this._sidenavOpened ? 'chevron_left' : 'menu';
  }
  //#endregion

  constructor(private _mobileDetector: MobileDetectorService) { }

  ngOnInit(): void { }

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
