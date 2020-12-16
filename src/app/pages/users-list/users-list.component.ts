import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { UserCreationDialogComponent } from 'src/app/components/dialogs/user-creation-dialog/user-creation-dialog.component';
import { User } from 'src/app/model/user';
import { UsersListService } from 'src/app/services/users-list.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class UsersListComponent extends CommonListViewComponent<User> {
  constructor(
    restService: UsersListService,
    http: HttpClient,
    dialogService: MatDialog,
    snackBar: MatSnackBar,
  ) {
    super(restService, snackBar, dialogService);

    this._pageTitle = 'Users'
    this._themeItemNameSingle = 'user';
    this._restService = new UsersListService(http);
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(UserCreationDialogComponent)
      .afterClosed()
      .pipe(
        this.handleAfterClosed()
      ).subscribe()
  }
}
