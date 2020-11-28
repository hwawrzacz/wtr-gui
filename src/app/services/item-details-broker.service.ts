import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsBrokerService<T> {
  private _item: T;

  get item(): T {
    return this._item;
  }

  set item(value: T) {
    this._item = value;
  }

  get hasItem(): boolean {
    return !!this._item;
  }

  constructor() { }
}
