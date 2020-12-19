import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stringifyUser, WorkLogTypeStringifier } from 'src/app/helpers/parsers';
import { SimpleUser } from 'src/app/model/simple-user';
import { WorkLog, WorkLogType } from 'src/app/model/work-log';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-work-logs-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class WorkLogsTableComponent extends CommonTableComponent<WorkLog> implements OnInit {

  constructor(navigator: NavigatorService<WorkLog>) {
    super(navigator);
    this._columnsDefinitions = [
      {
        defName: 'user',
        propertyName: 'user',
        displayName: 'User',
        formatter: (item: SimpleUser) => stringifyUser(item),
      },
      {
        defName: 'logDate',
        propertyName: 'dateTime',
        displayName: 'Log time',
      },
      {
        defName: 'logType',
        propertyName: 'type',
        displayName: 'Type',
        formatter: (item: WorkLogType) => WorkLogTypeStringifier.getTypeString(item),
      },
    ];
    this._actionsDefinitions = [];
  }

  ngOnInit(): void {
  }

}
