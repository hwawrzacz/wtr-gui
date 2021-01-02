import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { UserCreationDialogComponent } from 'src/app/components/dialogs/user-creation-dialog/user-creation-dialog.component';
import { Filter } from 'src/app/model/filter';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UsersListRestService } from 'src/app/services/rest/users-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class UsersListComponent extends CommonListViewComponent<User> {
  constructor(
    restService: UsersListRestService,
    dialogService: MatDialog,
    snackBarService: SnackBarService,
    authService: AuthService,
    mobileDetector: MobileDetectorService,
    navigator: NavigatorService<User>,
  ) {
    super(restService, snackBarService, dialogService, authService, mobileDetector, navigator);

    this._pageTitle = 'Użytkownicy'
    this._themeItemNameSingle = 'użytkownik';
    this._detailsUrl = 'users';
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(UserCreationDialogComponent)
      .afterClosed()
      .pipe(
        this.handleAfterClosed()
      ).subscribe()
  }

  public getRequiredFilter(): Filter[] {
    return [] as Filter[];
  }
}
