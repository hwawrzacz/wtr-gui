import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';

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

  /** Method which updates form */
  protected abstract updateForm(item: T): void;
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
  //#endregion

  //#region Saving changes
  public onSaveChanges(): void {
    this.saveAllChanges();
    this.disableEditMode();
  }

  private saveAllChanges(): void {
    const patchObject = this.parseItemFromForm();
    this.patchObject<T>(patchObject);
  }

  /** Allows to parse item to the form appropriate for saving, 
   * e.g. when form holds whole object, but API requres only id.*/
  protected abstract parseItemFromForm(): T;

  public onDiscardChanges(): void {
    this.updateForm(this._initialItem);
    this.disableEditMode();
    this._changeDetector.detectChanges();
  }

  public enableEditMode() {
    this._editMode = true;
    this.enableForm();
  }

  public disableEditMode() {
    this._editMode = false;
    this.disableForm();
  }

  public disableForm() {
    this._form.disable();
  }

  public enableForm() {
    this._form.enable();
  }

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
  //#endregion

  //#region Form errors
  // TODO: Tmplement thing below
  // /** Method which return error message for specific form control */
  // public abstract getErrorMessage(controlName: string): string;
  //#endregion

  //#region Snackbar
  protected openSuccessSnackBar(message: string): void {
    this._snackBar.open(message, 'Ok', { duration: SUCCESS_SNACKBAR_DURATION });
  }

  protected openInfoSnackBar(message: string): void {
    this._snackBar.open(message, 'Ok', { duration: INFO_SNACKBAR_DURATION });
  }

  protected openErrorSnackBar(message: string): void {
    this._snackBar.open(message, 'Ok');
  }
  //#endregion
}
