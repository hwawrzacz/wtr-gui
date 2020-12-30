import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { CreationResponseParser } from 'src/app/helpers/parsers';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { PatchResponse, SingleItemResponse } from 'src/app/model/responses';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonRestService } from 'src/app/services/rest/common-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-common-item-details',
  template: '',
  styleUrls: ['./common-item-details.component.scss']
})
export abstract class CommonItemDetailsComponent<T> implements OnInit, OnDestroy {
  protected _loadingCounter: number;
  protected _error: boolean;
  protected _query: Query;
  protected _initialItem: T;
  protected _form: FormGroup;
  private _editMode: boolean;
  protected _destroyed: Subject<void>;

  //#region Getters and setters
  get itemId(): string {
    return this._navigator.getIdFromUrl();
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
    protected _navigator: NavigatorService<T>,
    private _itemDetailsBroker: ItemDetailsBrokerService<T>,
    protected _restService: CommonRestService<T>,
    protected _formBuilder: FormBuilder,
    private _changeDetector: ChangeDetectorRef,
    private _snackBarService: SnackBarService,
    protected _dialogService: MatDialog,
    protected _loginService: AuthService,
  ) {
    const filter = { name: 'login', values: [] } as Filter;
    this._query = { searchString: '', filters: [filter] } as Query;
    this._loadingCounter = 0;
  }

  ngOnInit(): void {
    this._destroyed = new Subject();
    this._error = false;
    this._editMode = false;
    this._form = this.buildForm();
    this.loadItem();
  }

  //#region Initializers
  private loadItem() {
    if (this._itemDetailsBroker.hasItem
      && this._itemDetailsBroker.item['_id'] === this.itemId
    ) {
      this._snackBarService.openInfoSnackBar('Załadowane przez pośrednika.');
      this.loadDataFromBroker();
    } else {
      this._snackBarService.openInfoSnackBar('Załadowane z API.');
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
    this._restService.get(this.itemId)
      .pipe(
        take(1),
        tap((res: SingleItemResponse<T>) => {
          if (res.success) {
            this._initialItem = res.details;
            this.updateForm(this._initialItem);
          } else {
            this.handleResponseError(res);
          }
          this._loadingCounter--;
        }),
        catchError(() => of(this._error = true))
      ).subscribe();
  }

  private loadDataFromBroker(): void {
    this._initialItem = this._itemDetailsBroker.item
    this.updateForm(this._initialItem);
  }

  private handleResponseError(res: SingleItemResponse<T>, message?: string) {
    // TODO: Handle responses more specifically if needed, when responses list delivered from API
    this.openErrorSnackBar(message || res.message);
    console.error(res);
  }

  private handlePatchResponseError(res: PatchResponse, message?: string) {
    // TODO: Handle responses more specifically if needed, when responses list delivered from API
    this.openErrorSnackBar(message || res.message);
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

    // Remove fields that hasn't changed, and update those that has.
    Object.keys(patchObject).forEach(key => {
      if (patchObject[key] === this._initialItem[key] && typeof patchObject[key] !== 'object') delete patchObject[key];
      else this._initialItem[key] = patchObject[key];
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
    this._restService.patch<T>(this.itemId, name, value)
      .pipe(
        tap((res: PatchResponse) => {
          if (res.success) this.openSuccessSnackBar('Zaktualizowano wartość.');
          else this.handlePatchResponseError(res, 'Podczas zapisywania wystąpił błąd.');
        }),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  private deleteItem(): void {
    this._restService.patch<boolean>(this.itemId, 'active', false)
      .pipe(
        tap((res: PatchResponse) => {
          if (res.success) this.openSuccessSnackBar('Usunięto element.');
          else this.handlePatchResponseError(res, 'Podczas usuwania elementu wystąpił błąd.');
        }),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  protected patchObject<T>(object: T): void {
    this._restService.patchObject<T>(this.itemId, object)
      .pipe(
        tap((res: PatchResponse) => {
          if (res.success) this.openSuccessSnackBar('Zmiany zostały zapisane');
          else this.handleSavingFailed(res);
        }),
        catchError(err => this.handeRequestError(err))
      ).subscribe();
  }

  private handleSavingFailed(res: PatchResponse) {
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

  //#region Permissions
  public canEdit(): boolean {
    return this._loginService.isManager || this._loginService.isAdmin;
  }

  public canDelete(): boolean {
    return this._loginService.isManager || this._loginService.isAdmin;
  }

  public canShowStats(): boolean {
    return this._loginService.isManager
      || this._loginService.isAdmin
      || this._loginService.isEmployee;
  }
  //#endregion

  // TODO: Export snack bars to SnackBarService
  //#region Snackbar
  protected openSuccessSnackBar = (message: string): void => this._snackBarService.openSuccessSnackBar(message);

  protected openInfoSnackBar = (message: string): void => this._snackBarService.openInfoSnackBar(message);

  protected openWarningSnackBar = (message: string): void => this._snackBarService.openWarningSnackBar(message);

  protected openErrorSnackBar = (message: string): void => this._snackBarService.openErrorSnackBar(message);
  //#endregion

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
