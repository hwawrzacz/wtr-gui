import { Component, OnInit } from '@angular/core';
import { stringifyUser, WorkLogTypeStringifier } from 'src/app/helpers/parsers';
import { SimpleUser } from 'src/app/model/simple-user';
import { WorkLog, WorkLogType } from 'src/app/model/work-log';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-work-logs-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class WorkLogsTableComponent extends CommonTableComponent<WorkLog> implements OnInit {
  constructor(
    navigator: NavigatorService<WorkLog>,
    authService: AuthService,
  ) {
    super(navigator, authService);
    this._columnsDefinitions = [
      {
        defName: 'user',
        propertyName: 'idUser',
        displayName: 'Pracownik',
        formatter: (item: SimpleUser) => stringifyUser(item),
      },
      {
        defName: 'logDate',
        propertyName: 'logDate',
        displayName: 'Data',
        formatter: (dateStr: string): string => {
          return `${new Date(dateStr).toLocaleDateString('pl-PL')} ${new Date(dateStr).toLocaleTimeString('pl-PL')}`;
        }
      },
      {
        defName: 'logType',
        propertyName: 'logType',
        displayName: 'Typ zdarzenia',
        formatter: (item: WorkLogType) => WorkLogTypeStringifier.getTypeString(item),
      },
    ];
    this._actionsDefinitions = [];
  }

  ngOnInit(): void {
  }

}
