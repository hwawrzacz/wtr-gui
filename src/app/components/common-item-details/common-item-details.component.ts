import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-item-details',
  templateUrl: './common-item-details.component.html',
  styleUrls: ['./common-item-details.component.scss']
})
export class CommonItemDetailsComponent<T> implements OnInit {
  protected _loadingCounter: number;
  protected _error: boolean;
  protected _itemId: number | string;
  protected _initialItem: T;

  //#region Getters and setters
  get itemId(): number | string {
    return this._itemId;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get error(): boolean {
    return this._error;
  }
  //#endregion

  constructor(private _router: Router) {
    this._loadingCounter = 0;
  }

  ngOnInit(): void {
    this._itemId = this.getIdFromUrl();
  }

  private getIdFromUrl(): number | string {
    const params = this._router.url.split('/');

    return params[2];
  }
}
