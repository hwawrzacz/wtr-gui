import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-screen-loader',
  templateUrl: './full-screen-loader.component.html',
  styleUrls: ['./full-screen-loader.component.scss']
})
export class FullScreenLoaderComponent {
  private _appearance: 'spinner' | 'progress' | null;

  @Input('appearance')
  set appearance(value: 'spinner' | 'progress' | null) {
    this._appearance = value;
  }

  get isSpinner(): boolean {
    return this._appearance && this.appearance == 'spinner';
  }

  constructor() { }
}
