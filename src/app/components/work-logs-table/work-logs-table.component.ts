import { Component, OnInit } from '@angular/core';
import { stringifyEmployee, WorkLogTypeStringifier } from 'src/app/helpers/parsers';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { WorkLog, WorkLogType } from 'src/app/model/work-log';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ColumnDefinition, CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-work-logs-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class WorkLogsTableComponent extends CommonTableComponent<WorkLog> implements OnInit {

  constructor(navigator: NavigatorService<WorkLog>, itemDetailBroker: ItemDetailsBrokerService<WorkLog>) {
    super(navigator, itemDetailBroker);
    this._columnsDefinitions = [
      {
        defName: 'employee',
        propertyName: 'employee',
        displayName: 'Employee',
        formatter: (item: SimpleEmployee) => stringifyEmployee(item),
      } as ColumnDefinition,
      {
        defName: 'logDate',
        propertyName: 'dateTime',
        displayName: 'Log time',
      } as ColumnDefinition,
      {
        defName: 'logType',
        propertyName: 'type',
        displayName: 'Type',
        formatter: (item: WorkLogType) => WorkLogTypeStringifier.getTypeString(item),
      } as ColumnDefinition
    ];
    this._actionsDefinitions = [];
  }

  ngOnInit(): void {
  }

}
