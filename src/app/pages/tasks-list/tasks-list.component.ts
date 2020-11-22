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

  public onStatusFilterChange(event): void {
    const statuses = event.value;
    const filter = {
      name: 'status',
      value: statuses
    } as Filter;

    console.log(filter);
    // this.emitFilterChange();
  }
  public onPriorityFilterChange(event): void {
    const priorities = event.value;
    const filter = {
      name: 'priority',
      value: priorities
    } as Filter;

    console.log(filter);
    // this.emitFilterChange();
  }

  private emitFilterChange(value: Filter) {
    this.deobunceFilterChange.emit('filter-change');
  }

  public onQueryChanged(query: Query) {
    console.log('here');

    console.log(query);
  }

  // private subscribeToFilterChange(): void {
  //   fromEvent(this.deobunceFilterChange, 'filter-change').pipe(
  //     debounceTime(FILTER_DEBOUNCE_TIMEOUT),
  //     tap(() => {
  //       this.loadData(query);
  //     })
  //   ).subscribe();
  // }
}
