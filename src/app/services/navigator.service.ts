import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonItem } from '../model/common-item';
import { Section } from '../model/enums/section';
import { ItemDetailsBrokerService } from './item-details-broker.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService<T> implements OnDestroy {
  public urlChanges$: Subject<any>;
  public lastUrlInHistory$: Subject<any>;

  get activeSection(): Section {
    return this.getActiveSectionFromUrl();
  }

  constructor(
    private _router: Router,
    private _itemDetailsBroker: ItemDetailsBrokerService<CommonItem>,
  ) {
    this.urlChanges$ = new Subject<any>();
    this.lastUrlInHistory$ = new Subject<any>();
    this.setUpUrlChangeListener();
    this.setUpNavigationBackListener();
  }

  //#region Initialization
  private setUpUrlChangeListener(): void {
    this._router.events.subscribe((e) => this.urlChanges$.next(e));
  }

  private setUpNavigationBackListener(): void {
    window.addEventListener('hashchange', this.handlePotentialBackPressed)
  }

  private handlePotentialBackPressed = (): void => {
    if (document.referrer === "" && this.activeSection !== Section.LOGIN) {
      this.lastUrlInHistory$.next();
    }
  }
  //#endregion

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

  public goToRootHistoryElement(): void {
    const historySize = window.history.length;
    window.history.go(-historySize + 1);
  }
  //#endregion

  //#region Url operations
  private getActiveSectionFromUrl(url?: any): Section {
    url = url && url.path ? url.path : this._router.url;

    if (url.includes(Section.PROJECTS)) return Section.PROJECTS;
    else if (url.includes(Section.TASKS)) return Section.TASKS;
    else if (url.includes(Section.USERS)) return Section.USERS;
    else if (url.includes(Section.STATISTICS)) return Section.STATISTICS;
    else if (url.includes(Section.LOGIN)) return Section.LOGIN;
    else return Section.UNKNOWN;
  }

  public getIdFromUrl(url = this._router.url): string {
    const params = url.split('/');
    return params[2];
  }
  //#endregion

  ngOnDestroy(): void {
    window.removeEventListener('hashchange', this.handlePotentialBackPressed);
  }
}
