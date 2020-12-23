import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonItem } from 'src/app/model/common-item';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonDataSource } from '../../model/common-data-source';

export interface ColumnDefinition {
  defName: string;
  displayName: string;
  propertyName: string;
  /** Allows to format field.
   * For example when you want to stringify user object so that
   * first and last name are displayed.
   */
  formatter?: (obj: any) => string;
}

export interface ActionDefinition {
  icon: string;
  action: (item: CommonItem) => void;
  color?: string;
  tooltip?: string;
}

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent<T> {
  protected _detailsUrl: string;
  protected _columnsDefinitions: ColumnDefinition[];
  protected _actionsDefinitions: ActionDefinition[];
  private _dataSource: CommonDataSource<T>;
  private _isLoading: boolean;

  @Output('itemDeleted')
  private _itemDeletedEmitter: EventEmitter<string>;

  //#region Getters and setters
  get detailsUrl(): string {
    return this._detailsUrl;
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
    return !!this._actionsDefinitions && this._actionsDefinitions.length > 0;
  }

  get anyItemExists(): boolean {
    return this.dataSource ? this.dataSource.data.value.length > 0 : false;
  }
  //#endregion
  //#endregion

  constructor(
    private _navigator: NavigatorService<T>,
  ) {
    this._dataSource = new CommonDataSource<T>([]);
    this._itemDeletedEmitter = new EventEmitter<string>();
  }

  public navigateToDetails(itemId: string, edit = false): void {
    this._navigator.navigateToDetails(this._detailsUrl, itemId);
  }

  public navigateToDetailsWithData(item: CommonItem, edit = false): void {
    this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
  }

  public navigateToStats(itemId: string): void {
    this._navigator.navigateToDetails(this._detailsUrl, itemId);
  }

  public navigateToStatsWithData(item: CommonItem): void {
    this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
  }

  protected delete(itemId: string): void {
    this._itemDeletedEmitter.emit(itemId);
  }

  public emitItemDeleted(itemId: string): void {
    this._itemDeletedEmitter.emit(itemId);
  }
}
