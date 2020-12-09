import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { stringifyUser } from 'src/app/helpers/parsers';
import { User } from 'src/app/model/user';
import { Position } from 'src/app/model/enums/position';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { UsersRestService } from 'src/app/services/users-rest.service';

@Component({
  selector: 'app-user-search-select',
  templateUrl: './user-search-select.component.html',
  styleUrls: ['./user-search-select.component.scss']
})
export class UserSearchSelectComponent implements OnInit {
  private _loadingCounter: number;
  private _initialValue: User;
  private _singleSelection: boolean;
  private _users: User[];
  private _filteredUsers: User[];
  private _onlyManagers: boolean;
  @ViewChild('input') inputItem: ElementRef;

  @Input('onlyManagers')
  set onlyManagers(value: boolean) {
    this._onlyManagers = value;
  }

  @Input('singleSelection')
  set singleSelection(value: boolean) {
    this._singleSelection = value;
  }

  @Input('initialValue')
  set initialValue(value: User) {
    this._initialValue = value;
  }

  @Output('selectionChange') selectionChangeEmitter: EventEmitter<User>;

  get isLoading(): boolean {
    return this._loadingCounter !== 0;
  }

  get singleSelection(): boolean {
    return this._singleSelection;
  }

  get initialValue(): User {
    return this._initialValue;
  }

  get filteredUsers(): User[] {
    return this._filteredUsers;
  }

  constructor(private _restService: UsersRestService) {
    this._loadingCounter = 0;
    this.selectionChangeEmitter = new EventEmitter<User>()
  }

  ngOnInit(): void {
    this.loadData();
  }

  //#region Initializers
  private loadData(): void {
    this._loadingCounter++;
    const filter = { name: 'position', values: [Position.MANAGER] } as Filter;
    const query = { searchString: '', filters: this._onlyManagers ? [filter] : [] } as Query;
    this._restService.get(query).pipe(
      tap(items => {
        this._loadingCounter--;
        this._users = items;
        this._filteredUsers = this._users;
      })
    ).subscribe();
  }
  //#endregion

  //#region On* functions
  public onKeyUp(event: any): void {
    const searchString = event.target.value;
    this.filterData(searchString);
  }

  public onSelectionChange(user: User): void {
    console.log(`${user.firstName} emit`);
    this.selectionChangeEmitter.emit(user);

    if (!this._singleSelection) {
      this.inputItem.nativeElement.blur();
      this.inputItem.nativeElement.focus();
    }
  }
  //#endregion

  private filterData(query: string): void {
    this._filteredUsers = this._users.filter(user => `${user.login} ${user.firstName} ${user.lastName}`.includes(query));
  }

  //#region Helpers
  stringifyUser(user: SimpleUser): string {
    return stringifyUser(user);
  }
  //#endregion
}
