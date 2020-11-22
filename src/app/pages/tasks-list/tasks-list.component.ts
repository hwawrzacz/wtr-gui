import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Priority, PriorityStringifier } from 'src/app/model/enums/priority';
import { Status, StatusStringifier } from 'src/app/model/enums/status';
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

  get statuses(): Status[] {
    return StatusStringifier.statusList;
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }

  public getStatusString(value: Status): string {
    return StatusStringifier.getStatusString(value);
  }

  public getPriorityString(value: Priority): string {
    return PriorityStringifier.getPriorityString(value);
  }
}
