import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fromEvent, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { CommonArrayResponse } from 'src/app/services/common-array-response';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { UsersRestService } from 'src/app/services/users-rest.service';
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

  // Table
  private _totalResults: number;
  private _pageSize: number;
  private _pageSizeOptions: number[];

  // Search
  protected _query: Query;
  protected _pagination: Pagination

  // Boolean
  protected _loadingCounter: number;

  //#region Getters and setters
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

  //#region Table
  get totalResults(): number {
    return this._totalResults
  }

  get pageSize(): number {
    return this._pageSize
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  //#endregion

  //#region Boolean calculated
  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }
  //#endregion
  //#endregion

  constructor() {
    this._loadingCounter = 0;
    this._pageSizeOptions = [5, 10, 25, 50];
    this._query = { searchString: '', filters: [] } as Query;
    this._pagination = { currentPage: 1, itemsPerPage: 10 } as Pagination;
    this._dataSource = new CommonDataSource<T>([]);
  }

  public ngOnInit(): void {
    this.loadData(this._query);
  }

  public ngAfterViewInit(): void {
    this.subsribeToPaginationChagnge();
  }

  protected loadData(query: Query) {
    this._loadingCounter++;
    try {
      this.getDataFromApi(query);
    } catch (e) {
      console.log(e);
      this.getMockData(query);
    }
  }

  private getDataFromApi(query: Query) {
    (this._restService as UsersRestService).getFromApi(query, this._pagination)
      .pipe(
        tap((result: CommonArrayResponse<SimpleUser[]>) => {
          this._dataSource.refresh(result.items as any);
          this._totalResults = result.totalResults
          this._pageSize = result.limit;
          this._loadingCounter--;
        }),
        // TODO (HW): Handle error properly
        catchError((e) => of(this.getMockData(query)))
      ).subscribe();
  }

  private getMockData(query: Query) {
    this._restService.get(query)
      .pipe(
        tap((result) => {
          this._dataSource.refresh(result);
          this._loadingCounter--;
        }),
        // TODO (HW): Handle error properly
        catchError(() => of(console.error(`Couldn't load data`)))
      ).subscribe();
  }

  private subsribeToPaginationChagnge(): void {
  }

  public onQueryChanged(query: Query): void {
    this._query = query;
    this.loadData(this._query);
  }

  public onPaginationChange(pagination: PageEvent): void {
    this._pagination = {
      currentPage: pagination.pageIndex + 1,
      itemsPerPage: pagination.pageSize
    }
    console.log(this._pagination);
    this.loadData(this._query);
  }
}
