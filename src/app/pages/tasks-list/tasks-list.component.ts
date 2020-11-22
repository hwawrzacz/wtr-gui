import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { FILTER_DEBOUNCE_TIMEOUT } from 'src/app/model/constants';
import { Priority, PriorityStringifier } from 'src/app/model/enums/priority';
import { Status, StatusStringifier } from 'src/app/model/enums/status';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { Task } from 'src/app/model/task';
import { TasksListService } from 'src/app/services/tasks-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss', './tasks-list.component.scss',]
})
export class TasksListComponent extends CommonListViewComponent<Task> implements OnInit {
  private deobunceFilterChange = new EventEmitter();

  constructor(http: HttpClient) {
    super();
    this._pageTitle = 'Tasks';
    this._themeItemNameSingle = 'task'
    this._restService = new TasksListService(http);
  }
}
