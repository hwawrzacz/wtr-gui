import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { UserCreationDialogComponent } from 'src/app/components/dialogs/user-creation-dialog/user-creation-dialog.component';
import { User } from 'src/app/model/user';
import { UsersRestService } from 'src/app/services/users-rest.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class UsersListComponent extends CommonListViewComponent<User> {
  constructor(http: HttpClient, private _dialogService: MatDialog) {
    super();

    this._pageTitle = 'Users'
    this._themeItemNameSingle = 'user';
    this._restService = new UsersRestService(http);
    this.openUserCreationDialog();
  }

  /** Common abstract */
  public openUserCreationDialog(): void {
    this._dialogService.open(UserCreationDialogComponent)
  }

}
