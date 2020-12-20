import { Component, Input, OnInit } from '@angular/core';
import { Position } from 'src/app/model/enums/position';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { User } from 'src/app/model/user';
import { UserPipe } from 'src/app/pipes/user.pipe';
import { UsersListService } from 'src/app/services/users-list.service';
import { CommonAutocompleteComponent } from '../common-autocomplete/common-autocomplete.component';


@Component({
  selector: 'app-users-autocomplete',
  templateUrl: '../common-autocomplete/common-autocomplete.component.html',
  styleUrls: ['../common-autocomplete/common-autocomplete.component.scss']
})
export class UsersAutocompleteComponent extends CommonAutocompleteComponent<User> implements OnInit {
  private _onlyManagers: boolean;

  @Input('onlyManagers')
  set onlyManagers(value: boolean) {
    this._onlyManagers = value;
  }

  constructor(restService: UsersListService) {
    super(restService);
  }

  ngOnInit(): void {
    if (this._onlyManagers) {
      this._query = this.createCustomQuery();
    }

    super.ngOnInit();
  }

  private createCustomQuery(): Query {
    const filter = { name: 'role', values: [Position.MANAGER] } as Filter;
    return { searchString: '', filters: this._onlyManagers ? [filter] : [] } as Query;
  }

  public filterData(query: string): void {
    this._filteredItems = this._items.filter(user => `${user.login} ${user.firstName} ${user.lastName}`.includes(query));
  }

  //#region Helpers
  public transformItem = (item: User): string => {
    return new UserPipe().transform(item);
  }
  //#endregion
}
