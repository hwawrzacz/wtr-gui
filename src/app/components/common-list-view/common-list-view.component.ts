import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Query } from 'src/app/model/query';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { CommonArrayResponse } from 'src/app/services/common-array-response';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { EmployeesRestService } from 'src/app/services/employees-rest.service';
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
  protected _query = { searchString: '', filters: [] } as Query;

  // Boolean
  protected _loadingCounter: number;

  constructor() {
    this._loadingCounter = 0;
    this._query = { searchString: '', filters: [] } as Query;
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
    return this._loadingCounter > 0;
  }
  //#endregion

  public ngOnInit(): void {
    this.loadData(this._query);
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
    (this._restService as EmployeesRestService).getFromApi(query)
      .pipe(
        tap((result: CommonArrayResponse<SimpleEmployee[]>) => {
          this._dataSource.refresh(result.users as any);
          console.log(result.users);
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

  public onQueryChanged(query: Query) {
    this._query = query;
    this.loadData(this._query);
  }
}
