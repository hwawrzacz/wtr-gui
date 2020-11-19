import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  constructor() { }

  @Input()
  sidenavOpened: boolean;

  @Output()
  toggleSidenav = new EventEmitter();

  get iconName(): string {
    return this.sidenavOpened ? 'chevron_left' : 'menu';
  }

  ngOnInit(): void {
  }

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
