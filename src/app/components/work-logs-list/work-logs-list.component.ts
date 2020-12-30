import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Filter } from 'src/app/model/filter';
import { WorkLog } from 'src/app/model/work-log';
import { AuthService } from 'src/app/services/auth.service';
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
    dialogService: MatDialog,
    authService: AuthService,
  ) {
    super(restService, snackBarService, dialogService, authService);
  }

  ngOnInit(): void {
    // TODO: Get user id from login service when available
    super.ngOnInit();
  }

  public openItemCreationDialog(): void { return }

  public getRequiredFilter(): Filter[] {
    // TODO: This can probably be removed when authorization is ready 
    const userId = this._authService.user._id;
    const taskFilter = { name: 'idTask', values: [`${this._taskId}`] } as Filter;
    const userFilter = { name: 'idUser', values: [`${userId}`] } as Filter;

    if (this._authService.isManager || this._authService.isAdmin) {
      return [taskFilter] as Filter[];
    } else if (this._authService.isEmployee) {
      return [taskFilter, userFilter] as Filter[];
    }
  }
}
