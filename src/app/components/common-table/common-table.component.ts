import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';
import { CommonResponse } from 'src/app/model/responses';
import { CommonRestService } from 'src/app/services/common-rest.service';
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
    private _restService: CommonRestService<T>,
    private _snackBar: MatSnackBar,
  ) {
    this._dataSource = new CommonDataSource<T>([]);
    this._itemDeletedEmitter = new EventEmitter<string>();
  }

  public navigateToDetails(itemId: string, edit = false): void {
    this._navigator.navigateToDetails(this._detailsUrl, itemId);
  }

  public navigateToDetailsWithData(item: T, edit = false): void {
    this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
  }

  public navigateToStats(itemId: string): void {
    this._navigator.navigateToDetails(this._detailsUrl, itemId);
  }

  public navigateToStatsWithData(item: T): void {
    this._navigator.navigateToDetailsWithData(this._detailsUrl, item);
  }

  protected delete(itemId: string): void {
    this._restService.delete(itemId).pipe(
      map(res => ({ success: !!res, message: res } as CommonResponse<any>)),
      tap((res: CommonResponse<any>) => this.handleDeleteResponse(res, itemId))
    ).subscribe();
  }

  private handleDeleteResponse(res: CommonResponse<any>, itemId: string): void {
    if (res.success) {
      this.onDeleteSuccess(itemId);
    }
    else (
      this.openDeleteFailedSnackBar(res.message)
    )
  }

  private onDeleteSuccess(itemId: string): void {
    this.openDeleteSuccessSnackBar();
    this.emitItemDeleted(itemId);
  }

  private emitItemDeleted(itemId: string): void {
    this._itemDeletedEmitter.emit(itemId);
  }

  //#region Snackbar
  private openDeleteSuccessSnackBar(): void {
    this.openSnackBar('Item deleted');
  }

  private openDeleteFailedSnackBar(errorMessage: string): void {
    this.openSnackBar(`Item was not deleted: ${errorMessage}`);
  }

  private openSnackBar(message): void {
    this._snackBar.open(message, 'Ok', { duration: 2000 });
  }
  //#endregion
}
