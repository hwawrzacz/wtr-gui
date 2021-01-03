import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { TaksCreationDialogComponent } from 'src/app/components/dialogs/taks-creation-dialog/taks-creation-dialog.component';
import { Filter } from 'src/app/model/filter';
import { Task } from 'src/app/model/task';
import { AuthService } from 'src/app/services/auth.service';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';
import { NavigatorService } from 'src/app/services/navigator.service';
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
    mobileDetector: MobileDetectorService,
    navigator: NavigatorService<Task>,
  ) {
    super(restService, snackBarService, dialogService, authService, mobileDetector, navigator);

    this._pageTitle = 'Zadania';
    this._themeItemNameSingle = 'zadanie'
    this._detailsUrl = 'tasks';
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(TaksCreationDialogComponent)
      .afterClosed()
      .pipe(this.handleAfterClosed())
      .subscribe()
  }
}
