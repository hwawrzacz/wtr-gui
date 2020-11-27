import { Component, Input } from '@angular/core';
import { CommonDataSource } from '../../model/common-data-source';

export interface ColumnDefinition {
  defName: string;
  displayName: string;
  propertyName: string;
  /** Allows to format field.
   * For example when you want to stringify employee object so that
   * first and last name are displayed.
   */
  formatter?: (obj: any) => string;
}

export interface ActionDefinition {
  icon: string;
  action: (id: string) => void;
  color?: string;
  tooltip?: string;
}

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent<T> {
  protected _columnsDefinitions: ColumnDefinition[];
  protected _actionsDefinitions: ActionDefinition[];
  private _dataSource: CommonDataSource<T>;
  private _isLoading: boolean;

  constructor() {
    this._dataSource = new CommonDataSource<T>([]);
  }

  get columnsToDisplay(): string[] {
    return this._columnsDefinitions.map(item => item.defName).concat(this.actionsDefined ? 'actions' : null).filter(col => !!col);
  }

  get columnsDefinitions(): ColumnDefinition[] {
    return this._columnsDefinitions;
  }

  get actionsDefinitions(): ActionDefinition[] {
    return this._actionsDefinitions;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input('isLoading')
  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  @Input('dataSource')
  set dataSource(value: CommonDataSource<T>) {
    this._dataSource = value;
  }

  get dataSource(): CommonDataSource<T> {
    return this._dataSource;
  }

  //#region Boolean calculated
  get actionsDefined(): boolean {
    return this._actionsDefinitions.length > 0;
  }

  get anyItemExists(): boolean {
    return this.dataSource ? this.dataSource.data.value.length > 0 : false;
  }
  //#endregion
}
