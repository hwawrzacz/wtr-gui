import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { stringifyUser } from 'src/app/helpers/parsers';
import { User } from 'src/app/model/user';
import { Position } from 'src/app/model/enums/position';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { UsersListService } from 'src/app/services/users-list.service';
import { Pagination } from 'src/app/model/pagination';
import { UserPipe } from 'src/app/pipes/user.pipe';

@Component({
  selector: 'app-user-search-select',
  templateUrl: './user-search-select.component.html',
  styleUrls: ['./user-search-select.component.scss']
})
export class UserSearchSelectComponent implements OnInit {
  private _loadingCounter: number;
  private _singleSelection: boolean;
  private _selectedUser: User;
  private _users: User[];
  private _filteredUsers: User[];
  private _onlyManagers: boolean;
  private _label: string;
  private _error: string;
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
    this._selectedUser = value;
  }

  @Input('label')
  set label(value: string) {
    this._label = value;
  }
  get label(): string {
    return this._label;
  }

  @Input('errorMessage')
  set errorMessage(value: string) {
    this._error = value;
  }
  get error(): string {
    return this._error;
  }

  @Output('selectionChange') selectionChangeEmitter: EventEmitter<User>;

  get isLoading(): boolean {
    return this._loadingCounter !== 0;
  }

  get singleSelection(): boolean {
    return this._singleSelection;
  }

  get initialValue(): User {
    return this._selectedUser;
  }

  get filteredUsers(): User[] {
    return this._filteredUsers;
  }

  constructor(private _restService: UsersListService) {
    this._loadingCounter = 0;
    this.selectionChangeEmitter = new EventEmitter<User>()
  }

  ngOnInit(): void {
    this.loadData();
  }

  //#region Initializers
  private loadData(): void {
    this._loadingCounter++;
    const filter = { name: 'role', values: [Position.MANAGER] } as Filter;
    const query = { searchString: '', filters: this._onlyManagers ? [filter] : [] } as Query;
    const pagination = { currentPage: 1, itemsPerPage: 100 } as Pagination;
    this._restService.find(query, pagination).pipe(
      tap(result => {
        this._loadingCounter--;
        this._users = result.items;
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
    this._selectedUser = user;
    this.selectionChangeEmitter.emit(this._selectedUser);

    if (!this._singleSelection) {
      this.inputItem.nativeElement.blur();
      this.inputItem.nativeElement.focus();
    }
  }

  public resetInput(): void {
    if (this.singleSelection) {
      const userPipe = new UserPipe();
      this.inputItem.nativeElement.value = userPipe.transform(this._selectedUser);
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
