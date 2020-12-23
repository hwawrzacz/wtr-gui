import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, OperatorFunction } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION } from 'src/app/model/constants';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { CommonResponse } from 'src/app/model/responses';
import { CommonArrayResponse } from 'src/app/model/common-array-response';
import { CommonListRestService } from 'src/app/services/rest/common-list-rest.service';
import { CommonDataSource } from '../../model/common-data-source';

@Component({
  selector: 'app-common-list-view',
  template: '',
  styleUrls: ['./common-list-view.component.scss']
})
export abstract class CommonListViewComponent<T> implements OnInit {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Data
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
  // TODO: Handle error in user-friendly way
  protected _error: boolean;

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

  get hasError(): boolean {
    return this._error;
  }
  //#endregion
  //#endregion

  constructor(
    protected _restService: CommonListRestService<T>,
    private _snackBar: MatSnackBar,
    protected _dialogService: MatDialog,
  ) {
    this._loadingCounter = 0;
    this._pageSizeOptions = [5, 10, 25, 50];
    this._query = { searchString: '', filters: [] } as Query;
    this._pagination = { currentPage: 1, itemsPerPage: 10 } as Pagination;
    this._dataSource = new CommonDataSource<T>([]);
  }

  public ngOnInit(): void {
    this.loadData();
  }

  protected loadData() {
    this._error = false;
    try {
      this.getDataFromApi();
    } catch (e) {
      this.getMockData();
    }
  }

  private getDataFromApi(): void {
    this._loadingCounter++;
    this._restService.find(this._query, this._pagination)
      .pipe(
        take(1),
        tap((result: CommonArrayResponse<T>) => {
          this._loadingCounter--;
          this._dataSource.refresh(result.items as any);
          this._totalResults = result.totalResults
          this._pageSize = result.limit;
        }),
        // TODO (HW): Handle error properly
        catchError((e) => {
          this._error = true;
          this.openErrorSnackBar(`Couldn't load items from API. Mock data loaded.`);
          this.getMockData()
          return of()
        })
      ).subscribe();
  }

  private getMockData(): void {
    this._loadingCounter++;
    this._restService.find(this._query, this._pagination)
      .pipe(
        take(1),
        tap((result) => {
          this._loadingCounter--;
          this._dataSource.refresh(result);
        }),
        // TODO (HW): Handle error properly
        catchError(() => of(console.error(`Couldn't load data.`)))
      ).subscribe();
  }

  public onQueryChanged(query: Query): void {
    this._query = query;
    this.loadData();
  }

  public onPaginationChange(pagination: PageEvent): void {
    this._pagination = {
      currentPage: pagination.pageIndex + 1,
      itemsPerPage: pagination.pageSize
    }
    this.loadData();
  }

  /** Handles opening item creation dialog, and all actions 
   * after it is closed, which are showing certain messages  */
  public abstract openItemCreationDialog(): void;

  protected handleAfterClosed(): OperatorFunction<any, unknown> {
    return (
      tap(res => {
        if (!!res) {
          this.openSuccessSnackBar(this.getAdditionSuccessMessage());
          this.loadData();
        }
        else this.openErrorSnackBar(this.getAdditionCancelledMessage());
      })
    )
  }

  public onItemDeleted(id: string): void {
    this.delete(id);
  }

  private delete(itemId: string): void {
    this._restService.delete(itemId).pipe(
      map(res => ({ success: !!res, message: res } as CommonResponse<any>)),
      tap((res: CommonResponse<any>) => this.handleDeleteResponse(res, itemId))
    ).subscribe();
  }

  private handleDeleteResponse(res: CommonResponse<any>, itemId: string): void {
    if (res.success) {
      this.onDeleteSuccess(itemId);
    } else {
      this.openDeleteFailedSnackBar(res.message);
    }
  }

  private onDeleteSuccess(itemId: string): void {
    this._dataSource.refresh(this.dataSource.data.value.filter(item => item['_id'] !== itemId));
    this.openDeleteSuccessSnackBar();
  }

  //#region Snackbar
  private openDeleteSuccessSnackBar(): void {
    this.openSuccessSnackBar('Item deleted');
  }

  private openDeleteFailedSnackBar(errorMessage: string): void {
    this.openErrorSnackBar(`Item was not deleted: ${errorMessage}`);
  }

  private openSuccessSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: SUCCESS_SNACKBAR_DURATION });
  }

  private openInfoSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: INFO_SNACKBAR_DURATION });
  }

  private openErrorSnackBar(message: string) {
    this._snackBar.open(message, 'Ok');
  }

  //#endregion

  //#region Helpers 
  private getAdditionSuccessMessage = (): string => {
    return `${(this.themeItemNameSingle[0].toUpperCase())}${this.themeItemNameSingle.substr(1, this.themeItemNameSingle.length - 1)} created`;
  }

  private getAdditionCancelledMessage = (): string => {
    return `Creating ${this.themeItemNameSingle} discarded`;
  }
  //#endregion
}
