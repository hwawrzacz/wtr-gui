import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-item-details',
  templateUrl: './common-item-details.component.html',
  styleUrls: ['./common-item-details.component.scss']
})
export class CommonItemDetailsComponent<T> implements OnInit {
  protected _isLoading: boolean;
  protected _itemId: number | string;
  protected _item: T;

  constructor(private _router: Router) { }

  //#region Getters and setters
  get itemId(): number | string {
    return this._itemId;
  }
  //#endregion

  ngOnInit(): void {
    this._itemId = this.getIdFromUrl();
  }

  private getIdFromUrl(): number | string {
    const params = this._router.url.split('/');

    return params[2];
  }
}
