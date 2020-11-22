import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Priority, Status, Task } from 'src/app/model/task';
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

  get statuses(): Status[] {
    return Object.values(Status) as Status[];
  }

  get priorities(): Priority[] {
    return Object.values(Priority) as Priority[];
  }

  public getStatusString(value: Status): string {
    switch (value) {
      case Status.NEW: return 'New';
      case Status.IN_PROGRESS: return 'In progress';
      case Status.DONE: return 'Done';
      default: return value;
    }
  }

  public getPriorityString(value: Priority): string {
    switch (value) {
      case Priority.LOW: return 'Low';
      case Priority.MEDIUM: return 'Medium';
      case Priority.HIGH: return 'High';
      default: return value;
    }
  }
}
