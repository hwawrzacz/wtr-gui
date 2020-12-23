import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { WorkLog } from 'src/app/model/work-log';
import { WorkLogsListRestService } from 'src/app/services/rest/work-logs-list-rest.service';
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

  constructor(
    restService: WorkLogsListRestService,
    snackBar: MatSnackBar,
    dialogService: MatDialog
  ) {
    super(restService, snackBar, dialogService);

    const projectFilter = { name: 'taskId', values: [`${this._taskId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public openItemCreationDialog(): void { return }

}
