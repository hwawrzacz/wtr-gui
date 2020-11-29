import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Task } from 'src/app/model/task';
import { TasksListService } from 'src/app/services/tasks-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss', './tasks-list.component.scss',]
})
export class TasksListComponent extends CommonListViewComponent<Task> implements OnInit {
  constructor(http: HttpClient) {
    super();
    this._pageTitle = 'Tasks';
    this._themeItemNameSingle = 'task'
    this._restService = new TasksListService(http);
  }
}
