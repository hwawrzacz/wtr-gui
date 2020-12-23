import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { TaksCreationDialogComponent } from 'src/app/components/dialogs/taks-creation-dialog/taks-creation-dialog.component';
import { Task } from 'src/app/model/task';
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
    dialogService: MatDialog
  ) {
    super(restService, snackBarService, dialogService);

    this._pageTitle = 'Zadania';
    this._themeItemNameSingle = 'zadanie'
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(TaksCreationDialogComponent)
      .afterClosed()
      .pipe(this.handleAfterClosed())
      .subscribe()
  }
}
