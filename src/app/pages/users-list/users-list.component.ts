import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { User } from 'src/app/model/user';
import { UsersRestService } from 'src/app/services/users-rest.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class UsersListComponent extends CommonListViewComponent<User> {
  constructor(http: HttpClient) {
    super();

    this._pageTitle = 'Users'
    this._themeItemNameSingle = 'user';
    this._restService = new UsersRestService(http);
  }

}
