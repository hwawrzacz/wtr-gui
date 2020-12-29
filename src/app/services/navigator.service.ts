import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonItem } from '../model/common-item';
import { Section } from '../model/enums/section';
import { ItemDetailsBrokerService } from './item-details-broker.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService<T> {
  get activeSection(): Section {
    return this.getActiveSectionFromUrl();
  }

  constructor(
    private _router: Router,
    private _itemDetailsBroker: ItemDetailsBrokerService<CommonItem>,
  ) { }

  //#region Navigation
  public navigateToMainSection(path: string): void {
    this._router.navigate([`/${path}`]);
  }

  public navigateToHomeScreen(): void {
    this._router.navigate(['/']);
  }

  public navigateToDetails(baseUrl: string, itemId: string): void {
    this._router.navigate([baseUrl, itemId]);
  }

  public navigateToDetailsWithData(baseUrl: string, item: CommonItem): void {
    this._itemDetailsBroker.item = item;
    this._router.navigate([baseUrl, item['_id']]);
  }
  //#endregion

  //#region Url operations
  private getActiveSectionFromUrl(): Section {
    const url = this._router.url;

    if (url.includes(Section.PROJECTS)) return Section.PROJECTS;
    else if (url.includes(Section.TASKS)) return Section.TASKS;
    else if (url.includes(Section.USERS)) return Section.USERS;
    else if (url.includes(Section.STATISTICS)) return Section.STATISTICS;
    else if (url.includes(Section.LOGIN)) return Section.LOGIN;
    else return Section.UNKNOWN;
  }

  public getIdFromUrl(url?: any): string {
    url = url && url.path ? url.path : this._router.url;
    const params = url.split('/');
    return params[2];
  }
  //#endregion
}
