import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, OperatorFunction } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { CommonArrayResponse } from 'src/app/services/common-array-response';
import { CommonArrayRestService } from 'src/app/services/common-array-rest.service';
import { CommonDataSource } from '../../model/common-data-source';
import { CommonCreationDialogComponent } from '../dialogs/common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-common-list-view',
  templateUrl: './common-list-view.component.html',
  styleUrls: ['./common-list-view.component.scss']
})
export abstract class CommonListViewComponent<T> implements OnInit {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Data
  protected _restService: CommonArrayRestService<T>
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

  constructor(
    private _snackBar: MatSnackBar,
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
    this._loadingCounter++;
    try {
      this.getDataFromApi();
    } catch (e) {
      console.log(e);
      this.getMockData();
    }
  }

  private getDataFromApi(): void {
    this._restService.find(this._query, this._pagination)
      .pipe(
        tap((result: CommonArrayResponse<T>) => {
          this._dataSource.refresh(result.items as any);
          this._totalResults = result.totalResults
          this._pageSize = result.limit;
          this._loadingCounter--;
        }),
        // TODO (HW): Handle error properly
        catchError((e) => {
          this.openSnackBar(`Couldn't load items from API. Mock data loaded.`);
          this.getMockData()
          return of()
        })
      ).subscribe();
  }

  private getMockData(): void {
    this._restService.find(this._query, this._pagination)
      .pipe(
        tap((result) => {
          this._dataSource.refresh(result);
          this._loadingCounter--;
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

  //#region Helpers 
  protected handleAfterClosed = (): OperatorFunction<any, unknown> => {
    return (
      tap(res => {
        if (!!res) {
          this.openSnackBar(this.getAdditionSuccessMessage());
          this.getDataFromApi();
        }
        else this.openSnackBar(this.getAdditionCancelledMessage());
      })
    )
  }

  private getAdditionSuccessMessage = (): string => {
    return `${(this.themeItemNameSingle[0].toUpperCase())}${this.themeItemNameSingle.substr(1, this.themeItemNameSingle.length - 1)} created`;
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, 'Ok', { duration: 2000 });
  }

  private getAdditionCancelledMessage = (): string => {
    return `Creating ${this.themeItemNameSingle} discarded`;
  }
  //#endregion
}
