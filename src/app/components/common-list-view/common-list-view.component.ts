import { EventEmitter } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { CommonDataSource } from '../../model/common-data-source';

@Component({
  selector: 'app-common-list-view',
  templateUrl: './common-list-view.component.html',
  styleUrls: ['./common-list-view.component.scss']
})
export class CommonListViewComponent<T> implements OnInit, AfterViewInit {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Data
  protected _restService: CommonRestService<T[]>
  protected _dataSource: CommonDataSource<T>;

  // Search
  // protected deobunceFilterChange = new EventEmitter<Query>();

  private readonly DEBOUNCE_TIMEOUT = 700;

  // Boolean
  protected _isLoading: boolean;

  constructor() {
    this._dataSource = new CommonDataSource<T>([]);
  }

  //#region Labels
  get pageTitle(): string {
    return this._pageTitle;
  }

  get themeItemNameSingle(): string {
    return this._themeItemNameSingle;
  }
  //#endregion

  //#region Data
  get dataSource(): CommonDataSource<T> {
    return this._dataSource;
  }

  set dataSource(value: CommonDataSource<T>) {
    this._dataSource = value;
  }
  //#endregion

  //#region Boolean calculated
  get isLoading(): boolean {
    return this._isLoading;
  }
  //#endregion

  public ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // this.subscribeToQueryChange();
  }

  protected loadData(query = '', pagination = null, filters = null) {
    this._isLoading = true;
    this._restService.get(query, pagination, filters)
      .pipe(
        tap((result) => {
          this._dataSource.refresh(result);
          this._isLoading = false;
        }),
        // TODO (HW): Handle error properly
        catchError(() => of(console.error(`Couldn't load data`)))
      ).subscribe();
  }

  // private subscribeToQueryChange(): void {
  //   fromEvent(this.deobunceFilterChange, 'keyup').pipe(
  //     debounceTime(this.DEBOUNCE_TIMEOUT),
  //     tap((event: any) => {
  //       const query = event.target.value;
  //       this.loadData(query);
  //     })
  //   ).subscribe();
  // }
}
