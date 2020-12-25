import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { CreationResponseParser } from 'src/app/helpers/parsers';
import { CreationResponseMessage } from 'src/app/model/enums/response-messages';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { CreationResponse, SingleItemResponse } from 'src/app/model/responses';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonRestService } from 'src/app/services/rest/common-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-common-item-details',
  templateUrl: './common-item-details.component.html',
  styleUrls: ['./common-item-details.component.scss']
})
export abstract class CommonItemDetailsComponent<T> implements OnInit {
  protected _loadingCounter: number;
  protected _error: boolean;
  protected _itemId: string;
  protected _query: Query;
  protected _initialItem: T;
  protected _form: FormGroup;
  private _editMode: boolean;

  //#region Getters and setters
  get itemId(): string {
    return this._itemId;
  }

  get initialItem(): T {
    return this._initialItem;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get error(): boolean {
    return this._error;
  }

  get form(): FormGroup {
    return this._form;
  }

  get editMode(): boolean {
    return this._editMode;
  }
  //#endregion

  constructor(
    private _navigator: NavigatorService<T>,
    private _itemDetailsBroker: ItemDetailsBrokerService<T>,
    protected _restService: CommonRestService<T>,
    protected _formBuilder: FormBuilder,
    private _changeDetector: ChangeDetectorRef,
    private _snackBarService: SnackBarService,
    protected _dialogService: MatDialog
  ) {
    const filter = { name: 'login', values: [] } as Filter;
    this._query = { searchString: '', filters: [filter] } as Query;
    this._loadingCounter = 0;
  }

  ngOnInit(): void {
    this._itemId = this.getIdFromUrl();
    this._error = false;
    this._editMode = false;
    this._form = this.buildForm();
    this.loadItem();
  }

  //#region Initializers
  private getIdFromUrl(): string {
    return this._navigator.getIdFromUrl();
  }

  private loadItem() {
    if (this._itemDetailsBroker.hasItem) {
      this.loadDataFromBroker();
    } else {
      this.loadDataFromApi();
    }
  }

  /** Method which returns form group corresponding to item model map. 
   * Keep in mind, that update mechanism relies on form controls names 
   * mathching the object properties, so if they are incompatibile
   * it won't work */
  protected abstract buildForm(): FormGroup;
  //#endregion

  //#region Data loaders
  public reloadData(): void {
    this.loadDataFromApi();
  }

  private loadDataFromApi(): void {
    this._loadingCounter++;
    this._error = false;
    this._restService.get(this._itemId)
      .pipe(
        take(1),
        tap((res: SingleItemResponse<T>) => {
          if (res.success) {
            this._initialItem = res.details;
            this.updateForm(this._initialItem);
            this._error = false;
            this._loadingCounter--;
          } else {
            this.handleResponseError(res);
          }
        }),
        catchError(() => of(this._error = true))
      ).subscribe();
  }

  private loadDataFromBroker(): void {
    this._initialItem = this._itemDetailsBroker.item
    this.updateForm(this._initialItem);
  }

  private handleResponseError(res: SingleItemResponse<T>) {
    // TODO: Handle responses more specifically if needed, when responses list delivered from API
    this.openErrorSnackBar(res.message);
    console.error(res);
  }

  /** Method which updates form */
  protected abstract updateForm(item: T): void;
  //#endregion

  //#region Saving changes
  public onSaveChanges(): void {
    this.saveAllChanges();
    this.disableEditMode();
  }

  private saveAllChanges(): void {
    let patchObject = this.parseItemFromForm();

    // Remove fields that hasn't changed
    Object.keys(patchObject).forEach(key => {
      if (patchObject[key] === this._initialItem[key] && typeof patchObject[key] !== 'object') delete patchObject[key];
    });

    this.patchObject<T>(patchObject);
  }

  protected parseItemFromForm(): T {
    return Object.keys(this._form.controls).reduce((prev, curr) => {
      const controlValue = this._form.get(curr).value;
      prev[curr] = controlValue;
      return prev;
    }, {}) as T;
  }

  /** Allows to parse item to the form appropriate for saving, 
   * e.g. when form holds whole object, but API requres only id, 
   * or form control has a different name than object. 
   * If no special parsing is required, this function can return
   * null, and default parsing will be applied */

  protected patch<T>(name: string, value: T): void {
    this._restService.patch<T>(this._itemId, name, value)
      .pipe(
        map(res => CreationResponseParser.mapStringResponseToCreationResponse(res)),
        tap(response => this.handeResponse(response, 'Zaktualizowano wartość.', 'Podczas zapisywania wystąpił błąd.')),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  private deleteItem(): void {
    this._restService.patch<boolean>(this._itemId, 'active', false)
      .pipe(
        map(res => CreationResponseParser.mapStringResponseToCreationResponse(res)),
        tap(response => this.handeResponse(response, 'Usunięto element.', 'Podczas usuwania elementu wystąpił błąd')),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  protected patchObject<T>(object: T): void {
    this._restService.patchObject<T>(this._itemId, object)
      .pipe(
        tap((res: CreationResponse) => {
          if (res.success) this.openSuccessSnackBar('Zmiany zostały zapisane');
          else this.handleSavingFailed(res);
        }),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  private handeResponse(response: CreationResponse, successMessage: string, errorMessage: string): any {
    if (response.success) this.openSuccessSnackBar(successMessage);
    else {
      this.openErrorSnackBar(errorMessage);
      console.error(response.message);
    }
  }

  private handleSavingFailed(res: CreationResponse) {
    const messageStr = CreationResponseParser.parseCreationResponseMessage(res.message);
    this.openErrorSnackBar(messageStr);
    this.updateForm(this._initialItem);
  }

  private handeRequestError(err: string): any {
    console.error(err);
    return of(this.openErrorSnackBar('Podczas wysyłania zapytania wystąpił błąd.'))
  }

  public onDiscardChanges(): void {
    this.updateForm(this._initialItem);
    this.disableEditMode();
    this._changeDetector.detectChanges();
  }

  public enableEditMode() {
    this._editMode = true;
    this._form.enable();
  }

  public disableEditMode() {
    this._editMode = false;
    this._form.disable();
  }
  //#endregion

  //#region Item deletion
  public onDeleteItem(): void {
    this._dialogService.open(ConfirmationDialogComponent, {
      data: {
        title: "Usuwanie elementu",
        message: "Tej akcji nie można cofnąć. Czy jestes pewien, że chcesz usunąć element?",
        warn: true,
      } as ConfirmationDialogData
    }).afterClosed()
      .pipe(
        take(1),
        tap(result => {
          if (result) {
            this.deleteItem();
            this._navigator.navigateToMainSection(this._navigator.activeSection);
          }
        })
      )
      .subscribe()
  }
  //#endregion

  //#region Form errors
  // TODO: Tmplement thing below
  // /** Method which return error message for specific form control */
  // public abstract getErrorMessage(controlName: string): string;
  //#endregion

  // TODO: Export snack bars to SnackBarService
  //#region Snackbar
  protected openSuccessSnackBar = (message: string): void => this._snackBarService.openSuccessSnackBar(message);

  protected openInfoSnackBar = (message: string): void => this._snackBarService.openInfoSnackBar(message);

  protected openWarningSnackBar = (message: string): void => this._snackBarService.openWarningSnackBar(message);

  protected openErrorSnackBar = (message: string): void => this._snackBarService.openErrorSnackBar(message);
  //#endregion
}
