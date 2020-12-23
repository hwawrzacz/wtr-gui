import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { ERROR_SNACKBAR_DURATION, INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION, WARNING_SNACKBAR_DURATION } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { CommonRestService } from 'src/app/services/rest/common-rest.service';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ErrorSnackBarComponent } from '../snack-bars/error-snack-bar/error-snack-bar.component';
import { InfoSnackBarComponent } from '../snack-bars/info-snack-bar/info-snack-bar.component';
import { SuccessSnackBarComponent } from '../snack-bars/success-snack-bar/success-snack-bar.component';
import { WarningSnackBarComponent } from '../snack-bars/warning-snack-bar/warning-snack-bar.component';

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

  constructor(private _navigator: NavigatorService<T>,
    private _itemDetailsBroker: ItemDetailsBrokerService<T>,
    protected _restService: CommonRestService<T>,
    protected _formBuilder: FormBuilder,
    private _changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
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
        tap(item => {
          if (!!item) {
            this._initialItem = item;
            this.updateForm(item);
            this._error = false;
            this._loadingCounter--;
          }
        }),
        catchError(() => of(this._error = true))
      ).subscribe();
  }

  private loadDataFromBroker(): void {
    this._initialItem = this._itemDetailsBroker.item
    this.updateForm(this._initialItem);
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
      if (patchObject[key] === this._initialItem[key]) delete patchObject[key];
    });

    console.log(patchObject);
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
        // TODO: Handle success and error SnackBar
        tap(response => {
          if (response) this.openSuccessSnackBar('Value updated successfully');
          else {
            this.openErrorSnackBar('Error while updating value');
            console.error(response);
          }
        }),
        catchError(e => of(console.error(e)))
      ).subscribe();
  }

  protected patchObject<T>(object: T): void {
    this._restService.patchObject<T>(this._itemId, object)
      .pipe(
        // TODO: Handle success and error SnackBar
        tap(response => {
          if (response) this.openSuccessSnackBar('Item updated successfully');
          else this.openErrorSnackBar('Error while updating item. Validation failed');
        }),
        catchError(e => of(this.openErrorSnackBar('Error while updating item. Request failed.')))
      ).subscribe();
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

  //#region Form errors
  // TODO: Tmplement thing below
  // /** Method which return error message for specific form control */
  // public abstract getErrorMessage(controlName: string): string;
  //#endregion

  // TODO: Export snack bars to SnackBarService
  //#region Snackbar
  protected openSuccessSnackBar(message: string): void {
    this._snackBar.openFromComponent(SuccessSnackBarComponent, {
      data: { message: message },
      duration: SUCCESS_SNACKBAR_DURATION,
    });
  }

  protected openInfoSnackBar(message: string): void {
    this._snackBar.openFromComponent(InfoSnackBarComponent, {
      data: { message: message },
      duration: INFO_SNACKBAR_DURATION,
    });
  }

  protected openWarningSnackBar(message: string): void {
    this._snackBar.openFromComponent(WarningSnackBarComponent, {
      data: { message: message },
      duration: WARNING_SNACKBAR_DURATION,
    });
  }

  protected openErrorSnackBar(message: string): void {
    this._snackBar.openFromComponent(ErrorSnackBarComponent, {
      data: { message: message },
      duration: ERROR_SNACKBAR_DURATION,
    });
  }
  //#endregion
}
