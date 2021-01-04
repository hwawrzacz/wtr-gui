import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { ArrayResponse } from 'src/app/model/responses';
import { CommonListRestService } from 'src/app/services/rest/common-list-rest.service';

@Component({
  selector: 'app-common-autocomplete',
  template: '',
  styleUrls: ['./common-autocomplete.component.scss']
})
export abstract class CommonAutocompleteComponent<T> implements OnInit {
  private _loadingCounter: number;
  private _error: boolean;
  protected _query: Query;
  protected _items: T[];
  protected _filteredItems: T[];
  private _selectedItem: T;

  private _singleSelection: boolean;
  private _label: string;
  private _readonly: boolean;
  private _formControl: FormControl;

  @ViewChild('input') inputItem: ElementRef;

  //#region Getters and setters
  @Input('singleSelection')
  set singleSelection(value: boolean) {
    this._singleSelection = value;
  }

  @Input('initialValue')
  set initialValue(value: T) {
    this._selectedItem = value;
  }

  @Input('label')
  set label(value: string) {
    this._label = value;
  }
  get label(): string {
    return this._label;
  }

  @Input('readonly')
  set readonly(value: boolean) {
    this._readonly = value;
  }
  get readonly(): boolean {
    return this._readonly;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get error(): boolean {
    return this._error;
  }

  get singleSelection(): boolean {
    return this._singleSelection;
  }

  get initialValue(): T {
    return this._selectedItem;
  }

  get filteredItems(): T[] {
    return this._filteredItems;
  }

  @Input('formControl')
  set formControl(value: FormControl) {
    this._formControl = value;
  }
  get formControl(): FormControl {
    return this._formControl;
  }

  @Output('selectionChange') protected _selectionChangeEmitter: EventEmitter<T>;
  //#endregion

  constructor(private _restService: CommonListRestService<T>) {
    this._loadingCounter = 0;
    this._query = { searchString: '', filters: [] } as Query;
    this._selectionChangeEmitter = new EventEmitter<T>()
  }

  ngOnInit(): void {
    this.loadData();
  }

  //#region 
  private loadData(filter = ''): void {
    this._loadingCounter++;
    this._error = false;
    const pagination = { currentPage: 1, itemsPerPage: 100 } as Pagination;
    this._restService.find(this._query, pagination).pipe(
      tap((res: ArrayResponse<T>) => {
        if (res.success) {
          this.handleResponseSuccess(res, filter);
        } else {
          this.handleResponseError(res);
        }
        this._loadingCounter--;
      })
    ).subscribe();
  }

  private handleResponseSuccess(res: ArrayResponse<T>, filter: string) {
    this._items = res.details.items;
    this._filteredItems = this._items;
    this.filterData(filter);
  }

  private handleResponseError(res: ArrayResponse<T>) {
    this._error = true;
    console.error(res);
  }
  //#endregion

  //#region On* functions
  public onKeyUp(event: any): void {
    if (this._error) {
      this.loadData();
    } else {
      const searchString = event.target.value;
      this._filteredItems = this.filterData(searchString);
    }
  }

  public onSelectionChange(item: T): void {
    this._selectedItem = item;
    this._selectionChangeEmitter.emit(this._selectedItem);

    if (!this._singleSelection) {
      this.inputItem.nativeElement.blur();
      this.inputItem.nativeElement.focus();
    }
  }

  public refocus() {
    this.inputItem.nativeElement.blur();
    this.inputItem.nativeElement.focus();
  }
  //#endregion

  /** Apply own filters on `this._items` field */
  public abstract filterData(query: string): T[];

  //#region  Helpers
  /** Apply 'to string' transformation in order to correctly display items */
  public abstract transformItem: (item: T) => string;

  public resetInput(): void {
    if (this.singleSelection) {
      this.inputItem.nativeElement.value = this.transformItem(this._selectedItem);
    }
  }

  public clearSelection(): void {
    this._selectedItem = null;
    this.inputItem.nativeElement.value = '';
    this._filteredItems = this.filterData('');
    this._selectionChangeEmitter.emit(this._selectedItem);
  }

  public getErrorMessage(): string {
    if (!!this.formControl) {
      if (this.formControl.hasError('required')) return 'Pole jest wymagane.';
      if (!this.formControl.valid) return 'Pole jest nieprawidłowe 🤐';
    }
    return null;
  }
  //#endregion
}
