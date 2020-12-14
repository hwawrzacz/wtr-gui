import { Component, Input, OnInit } from '@angular/core';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { WorkLog } from 'src/app/model/work-log';
import { WorkLogsListService } from 'src/app/services/work-logs-list.service';
import { CommonListViewComponent } from '../common-list-view/common-list-view.component';

@Component({
  selector: 'app-work-logs-list',
  templateUrl: './work-logs-list.component.html',
  styleUrls: ['./work-logs-list.component.scss']
})
export class WorkLogsListComponent extends CommonListViewComponent<WorkLog> implements OnInit {
  private _taskId: string;

  @Input('taskId')
  set taskId(value: string) {
    this._taskId = value;
  }

  constructor(restService: WorkLogsListService) {
    super()
    this._restService = restService;

    const projectFilter = { name: 'taskId', values: [`${this._taskId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
