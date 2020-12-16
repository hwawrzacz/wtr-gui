import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { Task } from 'src/app/model/task';
import { TasksListService } from 'src/app/services/tasks-list.service';
import { CommonListViewComponent } from '../common-list-view/common-list-view.component';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.scss']
})
export class ProjectTasksComponent extends CommonListViewComponent<Task> implements OnInit {
  private _projectId: number;

  @Input('projectId')
  set projectId(value: number) {
    this._projectId = value;
  }

  constructor(
    restService: TasksListService,
    snackBar: MatSnackBar,
    dialogService: MatDialog
  ) {
    super(restService, snackBar, dialogService);
    const projectFilter = { name: 'projectId', values: [`${this._projectId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public openItemCreationDialog(): void { return }
}
