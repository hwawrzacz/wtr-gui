import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, tap } from 'rxjs/operators';
import { Query } from 'src/app/model/query';

@Component({
  selector: 'app-common-search-bar',
  templateUrl: './common-search-bar.component.html',
  styleUrls: ['./common-search-bar.component.scss']
})
export class CommonSearchBarComponent implements OnInit {
  @Output('queryChange') public _queryChangeEvent = new EventEmitter<Query>();
  protected _debounceQueryChange = new EventEmitter();
  protected _query: Query;
  private _debounceTimeout: number;

  constructor() {
    this._query = { searchString: '', filters: [] } as Query;
  }

  @Input('debounceTimeout')
  set debounceTimeout(value: number) {
    this._debounceTimeout = value;
  }

  ngOnInit(): void {
    this.subscribeToDebounceQueryChanges();
  }

  private subscribeToDebounceQueryChanges(): void {
    this._debounceQueryChange.pipe(
      debounceTime(this._debounceTimeout),
      tap(() => this.emitQueryChange())
    ).subscribe();
  }

  public onSeachChange(event): void {
    const searchString = event.target.value;
    this._query.searchString = searchString;
    this.debounceQueryChange();
  }

  protected debounceQueryChange(): void {
    this._debounceQueryChange.emit();
  }

  private emitQueryChange(): void {
    this._queryChangeEvent.emit(this._query);
  }
}
