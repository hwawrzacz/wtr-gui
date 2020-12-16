import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Task } from 'src/app/model/task';
import { TasksListService } from 'src/app/services/tasks-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss', './tasks-list.component.scss',]
})
export class TasksListComponent extends CommonListViewComponent<Task> {
  constructor(
    restService: TasksListService,
    snackBar: MatSnackBar,
    dialogService: MatDialog
  ) {
    super(restService, snackBar, dialogService);

    this._pageTitle = 'Tasks';
    this._themeItemNameSingle = 'task'
  }

  public openItemCreationDialog(): void {
    console.log('Project creation dialog will be added soon');
  }
}
