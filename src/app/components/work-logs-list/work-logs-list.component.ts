import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { USER_ID_MOCK } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { WorkLog } from 'src/app/model/work-log';
import { WorkLogsListRestService } from 'src/app/services/rest/work-logs-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
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
  get taskId(): string {
    return this._taskId;
  }

  constructor(
    restService: WorkLogsListRestService,
    snackBarService: SnackBarService,
    dialogService: MatDialog
  ) {
    super(restService, snackBarService, dialogService);
  }

  ngOnInit(): void {
    // TODO: Get user id from login service when available
    const userId = USER_ID_MOCK;
    const taskFilter = { name: 'idTask', values: [`${this._taskId}`] } as Filter;
    const userFilter = { name: 'idUser', values: [`${userId}`] } as Filter;
    this._query = { searchString: '', filters: [taskFilter, userFilter] };

    super.ngOnInit();
  }

  public openItemCreationDialog(): void { return }

}
