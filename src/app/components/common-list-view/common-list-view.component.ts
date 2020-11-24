import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Query } from 'src/app/model/query';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { CommonDataSource } from '../../model/common-data-source';

@Component({
  selector: 'app-common-list-view',
  templateUrl: './common-list-view.component.html',
  styleUrls: ['./common-list-view.component.scss']
})
export class CommonListViewComponent<T> implements OnInit {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Data
  protected _restService: CommonRestService<T[]>
  protected _dataSource: CommonDataSource<T>;

  // Search
  private _query = { searchString: '', filters: [] } as Query;

  // Boolean
  protected _isLoading: number;

  constructor() {
    this._isLoading = 0;
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
    return this._isLoading > 0;
  }
  //#endregion

  public ngOnInit(): void {
    this.loadData(this._query);
  }

  protected loadData(query: Query) {
    this._isLoading++;
    this._restService.get(query)
      .pipe(
        tap((result) => {
          this._dataSource.refresh(result);
          this._isLoading--;
        }),
        // TODO (HW): Handle error properly
        catchError(() => of(console.error(`Couldn't load data`)))
      ).subscribe();
  }

  public onQueryChanged(query: Query) {
    this._query = query;
    this.loadData(this._query);
  }
}
