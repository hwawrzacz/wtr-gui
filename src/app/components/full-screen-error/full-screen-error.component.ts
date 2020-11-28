import { Component, EventEmitter, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-full-screen-error',
  templateUrl: './full-screen-error.component.html',
  styleUrls: ['./full-screen-error.component.scss']
})
export class FullScreenErrorComponent {
  @Output('reloadRequest') reloadEventEmitter: EventEmitter<void>;

  constructor() {
    this.reloadEventEmitter = new EventEmitter<void>();
  }

  public requestReload(): void {
    this.reloadEventEmitter.emit();
  }
}
