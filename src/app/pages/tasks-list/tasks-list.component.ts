import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { TaksCreationDialogComponent } from 'src/app/components/dialogs/taks-creation-dialog/taks-creation-dialog.component';
import { Filter } from 'src/app/model/filter';
import { Task } from 'src/app/model/task';
import { AuthService } from 'src/app/services/auth.service';
import { TasksListRestService } from 'src/app/services/rest/tasks-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss', './tasks-list.component.scss',]
})
export class TasksListComponent extends CommonListViewComponent<Task> {
  constructor(
    restService: TasksListRestService,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
    authService: AuthService,
  ) {
    super(restService, snackBarService, dialogService, authService);

    this._pageTitle = 'Zadania';
    this._themeItemNameSingle = 'zadanie'
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(TaksCreationDialogComponent)
      .afterClosed()
      .pipe(this.handleAfterClosed())
      .subscribe()
  }

  public getRequiredFilter(): Filter[] {
    // TODO: This will probably be handled by authorization.
    // if (this._authService.isManager || this._authService.isAdmin) {
    //   return [] as Filter[];
    // } else if (this._authService.isEmployee) {
    //   const userId = this._authService.user._id;
    //   const userFilter = { name: 'idUser', values: [`${userId}`] } as Filter;
    //   return [userFilter] as Filter[];
    // }
    return [] as Filter[];
  }
}
