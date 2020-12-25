import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { of, OperatorFunction } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Filter } from 'src/app/model/filter';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { ArrayResponse, PatchResponse } from 'src/app/model/responses';
import { CommonListRestService } from 'src/app/services/rest/common-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
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
    private _snackBarService: SnackBarService,
    protected _dialogService: MatDialog,
  ) {
    this._loadingCounter = 0;
    this._pageSizeOptions = [5, 10, 25, 50];
    this._query = { searchString: '', filters: [] } as Query;
    this._pagination = { currentPage: 1, itemsPerPage: 10 } as Pagination;
    this._dataSource = new CommonDataSource<T>([]);
  }

  public ngOnInit(): void {
    this.updateRequiredFilters();
    this.loadData();
  }

  public loadData() {
    this.getDataFromApi();
  }

  private getDataFromApi(): void {
    this._error = false;
    this._loadingCounter++;
    this._restService.find(this._query, this._pagination)
      .pipe(
        take(1),
        tap((res: ArrayResponse<T>) => {
          this._loadingCounter--;
          if (res.success) {
            this.handleResponseSuccess(res);
          } else {
            this.handleResponseError(res);
          }
        }),
        catchError(() => {
          this._error = true;
          this._loadingCounter--;
          this.openErrorSnackBar(`Nie można pobrać danych z API. Pobieranie danych sztucznych.`);
          return of()
        })
      ).subscribe();
  }

  private handleResponseSuccess(res: ArrayResponse<T>) {
    this._dataSource.refresh(res.details.items as any);
    this._totalResults = res.details.totalResults
    this._pageSize = res.details.limit;
  }

  private handleResponseError(res: ArrayResponse<T>) {
    this.openErrorSnackBar(res.message);
    console.error(res);
  }

  public onQueryChanged(query: Query): void {
    this._query = query;
    this.updateRequiredFilters();
    this.loadData();
  }

  private updateRequiredFilters(): void {
    const requiredFilters = this.getRequiredFilter();
    requiredFilters.forEach(filter => {
      if (!this._query.filters.map(f => f.name).includes(filter.name)) this._query.filters.push(filter);
    });
  }

  public abstract getRequiredFilter(): Filter[];

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
          this.openSuccessSnackBar('Dodano element.');
          this.loadData();
        }
        else this.openInfoSnackBar('Anulowano dodawanie elementu.');
      })
    )
  }

  public onItemDeleted(id: string): void {
    this.delete(id);
  }

  private delete(itemId: string): void {
    this._restService.delete(itemId).pipe(
      tap((res: PatchResponse) => this.handleDeleteResponse(res, itemId))
    ).subscribe();
  }

  private handleDeleteResponse(res: PatchResponse, itemId: string): void {
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
    this.openSuccessSnackBar('Usunięto element.');
  }

  private openDeleteFailedSnackBar(errorMessage: string): void {
    this.openErrorSnackBar(`Element nie został usunięty: ${errorMessage}.`);
  }

  private openSuccessSnackBar(message: string) {
    this._snackBarService.openSuccessSnackBar(message);
  }

  private openInfoSnackBar(message: string) {
    this._snackBarService.openInfoSnackBar(message);
  }

  private openErrorSnackBar(message: string) {
    this._snackBarService.openErrorSnackBar(message);
  }

  //#endregion
}
