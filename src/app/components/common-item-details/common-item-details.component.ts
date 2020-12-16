import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
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
    protected _formBuilder: FormBuilder
  ) {
    const filter = { name: 'login', values: [] } as Filter;
    this._query = { searchString: '', filters: [filter] } as Query;
    this._loadingCounter = 0;
  }

  ngOnInit(): void {
    this._itemId = this.getIdFromUrl();
    this._error = false;
    this._editMode = false;
    this._form = this.buildEmptyForm();
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

  protected reinitializeForm(): void {
    this._form = this.buildForm();
  }

  private buildEmptyForm(): FormGroup {
    return this._formBuilder.group({});
  }

  /** Method which returns form group corresponding to item model map */
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
          this._loadingCounter--;
          console.log(item);
          if (!!item) {
            this._initialItem = item;
            this.reinitializeForm();
            this._error = false;
          }
        }),
        catchError(() => of(this._error = true))
      ).subscribe();
  }

  private loadDataFromBroker(): void {
    this._initialItem = this._itemDetailsBroker.item
    this.reinitializeForm();
  }
  //#endregion

  //#region Saving changes

  public onSaveChanges(): void {
    this.saveAllChanges();
    this.disableEditMode();
  }

  private saveAllChanges(): void {
    Object.keys(this._form.controls).forEach(controlName => {
      this.onSaveField(controlName);
    });
  }

  public onDiscardChanges(): void {
    this.reinitializeForm();
    this.disableEditMode();
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

  public onSaveField(name: string) {
    const field = this._form.get(name);
    this._initialItem[name] = field.value;
    console.log(this._initialItem[name]);
    this.patch(name, field.value);
  }

  protected patch<T>(name: string, value: T): void {
    this._restService.patch<T>(this._itemId, name, value)
      .pipe(
        // TODO: Handle success and error SnackBar
        tap(response => console.log(response)),
        catchError(e => of(console.error(e)))
      ).subscribe();
  }
  //#endregion

  //#region Form errors
  public hasError(controlName: string): boolean {
    return this._form.get(controlName).valid;
  };

  // /** Method which return sepcific error message */
  // public abstract getErrorMessage(controlName: string): string;
  //#endregion
}
