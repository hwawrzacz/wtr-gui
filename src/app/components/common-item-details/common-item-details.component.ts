import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Query } from 'src/app/model/query';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';

@Component({
  selector: 'app-common-item-details',
  templateUrl: './common-item-details.component.html',
  styleUrls: ['./common-item-details.component.scss']
})
export abstract class CommonItemDetailsComponent<T> implements OnInit {
  protected _loadingCounter: number;
  protected _error: boolean;
  protected _itemId: number | string;
  protected _query: Query;
  protected _initialItem: T;
  protected _form: FormGroup;
  protected _editables: Map<string, boolean>;

  //#region Getters and setters
  get itemId(): number | string {
    return this._itemId;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get error(): boolean {
    return this._error;
  }
  //#endregion

  constructor(private _router: Router,
    private _itemDetailsBroker: ItemDetailsBrokerService<T>,
    private _restService: CommonRestService<T>,
    protected _formBuilder: FormBuilder
  ) {
    this._loadingCounter = 0;
  }

  ngOnInit(): void {
    this._itemId = this.getIdFromUrl();
    this._error = false;
    this.setEditables();
    this._form = this.buildEmptyForm();
    this.loadItem();
  }

  //#region Initializers
  private getIdFromUrl(): number | string {
    const params = this._router.url.split('/');
    return params[2];
  }

  private loadItem() {
    if (this._itemDetailsBroker.hasItem) {
      this.loadDataFromBroker();
    } else {
      this.loadDataFromApi();
    }
  }

  /** Function which sets editables map */
  protected abstract setEditables(): void;

  protected reinitializeForm(): void {
    this._form = this.buildForm();
  }

  private buildEmptyForm(): FormGroup {
    return this._formBuilder.group({
      title: ['', [Validators.required]],
      manager: [null, [Validators.required]],
      description: ['']
    });
  }

  protected abstract buildForm(): FormGroup;
  //#endregion

  //#region Data loaders
  public reloadData(): void {
    this.loadDataFromApi();
  }

  private loadDataFromApi(): void {
    this._loadingCounter++;
    this._error = false;
    this._restService.get(this._query)
      .pipe(
        take(1),
        tap(proj => {
          this._loadingCounter--;
          if (!!proj) {
            this._initialItem = proj;
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
  public onSaveField(name: string) {
    const field = this._form.get(name);
    this._initialItem[name] = field.value;
    this.disableEdition(name);
    console.log(this._initialItem[name]);
    // TODO (HW): Sent update request to API
  }

  public onDiscardFieldChange(name: string) {
    const field = this._form.get(name);
    field.patchValue(this._initialItem[name]);
    this.disableEdition(name);
  }
  //#endregion

  //#region Editable handling
  public isEditable(controlName: string): boolean {
    return this._editables.get(controlName);
  }

  public enableEdition(controlName: string): void {
    this.setEditionStatus(controlName, true);
  }

  public disableEdition(controlName: string): void {
    this.setEditionStatus(controlName, false);
  }

  private setEditionStatus(controlName: string, value: boolean): void {
    this._editables.set(controlName, value);
  }
  //#endregion
}
