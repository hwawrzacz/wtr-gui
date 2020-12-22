import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { CommonArrayRestService } from 'src/app/services/common-array-rest.service';

@Component({
  selector: 'app-common-autocomplete',
  template: '',
  styleUrls: ['./common-autocomplete.component.scss']
})
export abstract class CommonAutocompleteComponent<T> implements OnInit {
  private _loadingCounter: number;
  protected _query: Query;
  protected _items: T[];
  protected _filteredItems: T[];
  private _selectedItem: T;

  private _singleSelection: boolean;
  private _label: string;
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

  get isLoading(): boolean {
    return this._loadingCounter !== 0;
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

  @Output('selectionChange') selectionChangeEmitter: EventEmitter<T>;
  //#endregion

  constructor(private _restService: CommonArrayRestService<T>) {
    this._loadingCounter = 0;
    this._query = { searchString: '', filters: [] } as Query;
    this.selectionChangeEmitter = new EventEmitter<T>()
  }

  ngOnInit(): void {
    this.loadData();
  }

  //#region 
  private loadData(): void {
    this._loadingCounter++;
    const pagination = { currentPage: 1, itemsPerPage: 100 } as Pagination;
    this._restService.find(this._query, pagination).pipe(
      tap(result => {
        this._loadingCounter--;
        this._items = result.items;
        this._filteredItems = this._items;
      })
    ).subscribe();
  }
  //#endregion

  //#region On* functions
  public onKeyUp(event: any): void {
    const searchString = event.target.value;
    this._filteredItems = this.filterData(searchString);
  }

  public onSelectionChange(item: T): void {
    this._selectedItem = item;
    this.selectionChangeEmitter.emit(this._selectedItem);

    if (!this._singleSelection) {
      this.inputItem.nativeElement.blur();
      this.inputItem.nativeElement.focus();
    }
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
    this.selectionChangeEmitter.emit(this._selectedItem);
  }

  public getErrorMessage(): string {
    if (this.formControl.hasError('required')) return 'Value is required';
    else if (!this.formControl.valid) return 'Something is not yes';
    return null;
  }
  //#endregion
}
