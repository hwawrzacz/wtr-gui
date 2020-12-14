import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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

  constructor(http: HttpClient, _snackBar: MatSnackBar) {
    super(_snackBar);
    this._restService = new TasksListService(http);
    const projectFilter = { name: 'projectId', values: [`${this._projectId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
