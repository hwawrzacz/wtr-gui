import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { CommonDataSource } from './common-data-source';

export interface ColumnDefinition {
  defName: string;
  displayName: string;
  propertyName: string;
}

export interface ActionDefinition {
  icon: string;
  action: (id: number) => void;
  color?: string;
  tooltip?: string;
}

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent<T> implements OnInit {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Table
  protected _columnsDefinitions: ColumnDefinition[];
  protected _actionsDefinitions: ActionDefinition[];

  // Data
  private _restService: CommonRestService<T[]>
  private _dataSource: CommonDataSource<T>;

  // Boolean
  private _isLoading: boolean;

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

  //#region Table
  get columnsToDisplay(): string[] {
    return this._columnsDefinitions.map(item => item.defName).concat(this.actionsDefined ? 'actions' : null).filter(col => !!col);
  }

  get columnsDefinitions(): ColumnDefinition[] {
    return this._columnsDefinitions;
  }

  get actionsDefinitions(): ActionDefinition[] {
    return this._actionsDefinitions;
  }
  //#endregion

  //#region Data
  get restService(): CommonRestService<T[]> {
    return this._restService;
  }

  set restService(value: CommonRestService<T[]>) {
    this._restService = value;
  }

  get dataSource(): CommonDataSource<T> {
    return this._dataSource;
  }

  set dataSource(value: CommonDataSource<T>) {
    this._dataSource = value;
  }
  //#endregion

  //#region Boolean calculated
  get actionsDefined(): boolean {
    return this._actionsDefinitions.length > 0;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }
  //#endregion

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(query = '') {
    this.isLoading = true;
    this.restService.get(query)
      .pipe(
        tap((result) => {
          console.log('getting data');
          this._dataSource.refresh(result);
          this.isLoading = false;
        }),
        catchError(() => of(console.error(`Couldn't load data`)))
      ).subscribe();
  }
}
