import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonItem } from 'src/app/model/common-item';
import { AuthService } from 'src/app/services/auth.service';
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
  /** Action which should be performed when button clicked */
  action: (item: CommonItem) => void;
  /** Rule which determines whether this action can be displayed or not.
   * If no function is set, action will be displayed */
  canDisplay?: () => boolean;
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
  private _readonly: boolean;

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

  get availableActions(): ActionDefinition[] {
    return this._actionsDefinitions.filter(action => !action || !!action && action.canDisplay());
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input('readonly')
  set readonly(value: boolean) {
    this._readonly = value;
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
    return !!this.availableActions && this.availableActions.length > 0;
  }

  get anyItemExists(): boolean {
    return this.dataSource ? this.dataSource.data.value.length > 0 : false;
  }
  //#endregion
  //#endregion

  constructor(
    private _navigator: NavigatorService<T>,
    private _loginService: AuthService,
  ) {
    this._dataSource = new CommonDataSource<T>([]);
    this._itemDeletedEmitter = new EventEmitter<string>();
  }

  public canShowStats(): boolean {
    return this._loginService.isManager
  }

  public canDelete(): boolean {
    return this._loginService.isManager || this._loginService.isAdmin;
  }

  public navigateToDetails(itemId: string, edit = false): void {
    if (!this._readonly) {
      this._navigator.navigateToDetails(this._detailsUrl, itemId);
    }
  }

  public navigateToDetailsWithData(item: CommonItem, edit = false): void {
    if (!this._readonly) {
      this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
    }
  }

  public navigateToStats(itemId: string): void {
    if (!this._readonly) {
      this._navigator.navigateToDetails(this._detailsUrl, itemId);
    }
  }

  public navigateToStatsWithData(item: CommonItem): void {
    if (!this._readonly) {
      this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
    }
  }

  protected delete(itemId: string): void {
    this._itemDeletedEmitter.emit(itemId);
  }

  public emitItemDeleted(itemId: string): void {
    this._itemDeletedEmitter.emit(itemId);
  }
}
